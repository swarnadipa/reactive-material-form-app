import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateUserInfoComponent } from './update-user-info/update-user-info.component';
import { UserInfoComponent } from './user-info/user-info.component';


const routes: Routes = [
  {
    path: 'add-edit/:uuid',
    component: UpdateUserInfoComponent
  },
  {
    path: 'add-edit',
    component: UpdateUserInfoComponent
  },
  {
    path: 'user-info',
    component: UserInfoComponent,
  },
  {
    path: '',
    component: UserInfoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
