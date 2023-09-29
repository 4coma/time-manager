import { Component } from '@angular/core';
import { TagService } from 'src/app/services/tag.service';
import { Tag } from './interfaces/tag.interface';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  userTags: Tag[] = []; 
  selectedTag?: Tag; // Assuming you have a selectedTag property to keep track of the currently selected tag

  constructor(
    private tagsService: TagService,
    private alertController: AlertController
  ) {
    this.tagsService.o_tags.subscribe((tags: Tag[]) => {
      this.userTags = tags;
    });
  }

  async deleteTag(tag: Tag){
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete this tag?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('deleting');
            
            const index = this.userTags.findIndex(tag => tag.id === tag?.id);
            console.log('index : ', index);
            if (index !== -1) {
              this.userTags.splice(index, 1);
              this.tagsService.deleteTag(tag.id);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
