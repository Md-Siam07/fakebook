import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoryService } from '../shared/story.service';
import { UserService } from '../shared/user-service.service';
import { User } from '../shared/user.model';
import { Story } from '../shared/story.model'

@Component({
  selector: 'app-create-story',
  templateUrl: './create-story.component.html',
  styleUrls: ['./create-story.component.css']
})
export class CreateStoryComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService, private storyService: StoryService) { }
  userInfo = new User();
  file!: File;
  story = new Story();
  storyList: Story[] = [];

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.userInfo = res['user'];
        //this.story.fullName = this.userInfo.fullName;
        //this.story.email = this.userInfo.email;
        
      }, 
      err => {
        
      }
    )
  }

  uploadFile(event:any) {
    this.file = event.target.files[0];
  }

  post(){
    
    this.storyService.postStory(this.story, this.file).subscribe(
      (res:any) => {
        this.router.navigate(['dashboard']);
        this.toastr.success('story uploaded');
      },
      err => {
        this.toastr.error('Story upload failed')
      }
    )
  }

}
