import { Component, OnInit } from '@angular/core';
import { WebSocketAPIService } from './WebSocketApi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  title = 'ChessWeb';
  
  
  constructor(private webSocketApiService: WebSocketAPIService){}

  ngOnInit() {
    // this.connect()
    // setTimeout(() => {
    //   this.sendMessage()
    // }, 5000)

    // setTimeout(() => {
    //   this.disconnect()
    // }, 10000)
  }

  connect(){
    this.webSocketApiService._connect();
  }

  disconnect(){
    this.webSocketApiService._disconnect();
  }

  sendMessage(){
    this.webSocketApiService._send({"text": "dupa", "from":"dupa"});
  }

  // guide
  // https://www.javaguides.net/2019/06/spring-boot-angular-8-websocket-example-tutorial.html
}
