import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Status } from '../shared/status.model';
import { StatusService } from '../shared/status.service';
import { Story } from '../shared/story.model';
import { StoryService } from '../shared/story.service';
import { UserService } from '../shared/user-service.service';
import { User } from '../shared/user.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  minioHost: string="127.0.0.1";
  port: string="9000";
  bucket: string="stories";

  statusList : Status[] = [];
  statusText: string = '';
  newStatus = new Status();
  userInfo = new User();
  storyList: Story[] = [];
  filesURLs: String[] = [];
  constructor(private statusService: StatusService, private userService: UserService, private router: Router, private toastr: ToastrService, private storyService: StoryService) { }

  ngOnInit(): void {
    
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userInfo = res;
        //console.log(res)
      }
    )

    this.statusService.getStatus(this.userInfo.email).subscribe(
      (res:any)=>{
        this.statusList = res as Status[];
        //console.log(this.statusList)
      },
      (err) => {
        console.log(err)
      }
    )
    
    this.storyService.fetchStories(this.userInfo.email).subscribe(
      (res: any) => {
        //console.log(res)
        this.storyList = res as Story[];
        this.storyList.forEach(story => {
          console.log(story.storyURL)
          this.storyService.getObject(story.storyURL).subscribe(
            err => {
              console.log(err)
              console.log('error in file retrive ', JSON.stringify(err, undefined, 2))
            },
            (result:any) => {
              console.log(result.file)
              console.log(result)
              this.filesURLs.push(result.url)
            }
          )

          // story.storyURL = "http://"+this.minioHost+":"+this.port+"/"+this.bucket+"/"+ story.storyURL;
          // this.filesURLs.push(story.storyURL)
        });
        //console.log(this.storyList)
      },
      err => {
        console.log('error')
      }
    )
  }

  createPost(){
    this.newStatus.status = this.statusText;
    this.newStatus.time = Date.now().toString();
    this.statusService.postStatus(this.newStatus).subscribe(
      (res: any) => {
        this.statusText = "";
        this.toastr.success('Posted successfully')
        this.refreshStatus();
      },
      (err) => {
        this.toastr.error('An error occured')
      }
    )
  }

  refreshStatus(){
    this.statusService.getStatus(this.userInfo.email).subscribe(
      (res:any)=>{
        this.statusList = res as Status[];
        //console.log(this.statusList)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  remainingTime(input: string){
    return Math.floor((Date.now() - Number(input))/60000);
  }

  newLineFormat(input: string){
   // console.log(input.replace(/\\n/g, '\n'))
    return input.replace(/\\n/g, '\n');
  }

  createStory(){
    this.router.navigateByUrl('createStory')
  }

}