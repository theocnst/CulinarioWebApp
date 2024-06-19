import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private cloudName = 'dugrekmgp';
  private uploadPreset = 'p2ia7vmg';

  constructor(private http: HttpClient) {}

  uploadImage(image: File) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', this.uploadPreset);
    console.log(formData);

    return this.http.post(url, formData);
  }
}
