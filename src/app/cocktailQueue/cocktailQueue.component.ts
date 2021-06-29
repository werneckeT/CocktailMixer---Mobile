import { newArray } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { } from 'jquery';

declare var $: any;


class queueItem {
  public cocktailName;
  public cocktailCategory;
  public cocktailID;

  constructor(cocktailName:string, cocktailCategory:string, cocktailID:any) {
    this.cocktailName = cocktailName;
    this.cocktailCategory = cocktailCategory;
    this.cocktailID = cocktailID;
  }
}


@Component({
  selector: 'cocktailQueue',
  templateUrl: './cocktailQueue.component.html',
  styleUrls: ['./cocktailQueue.component.scss']
})
export class CocktailQueueComponent implements OnInit{
  public queueArray: Array<queueItem> = new Array<queueItem>();

  constructor() 
  {
  }

  ngOnInit() {
    this.getCocktailQueue().then(async () => {
      console.log(this.queueArray)
    })
  }

  public deleteCocktail(id:any) {
    $.post("http://5.230.70.236/api.php", {
      deleteQueueCocktail: id
    }, (response:any) => {
      console.log(response)
    });
    location.reload()
  }

  public async getCocktailQueue() {
    $.post("http://5.230.70.236/api.php", {
      queue: "getCocktailQueue"
    }, (response:any): void=> {

      //this.queueArray.splice(0, this.queueArray.length);

      // ID/Cocktail Name/Cocktail Category%ID/Cocktail Name/Cocktail Category
      if(response.includes("%")) {
        console.log(response)
        response.split("%").forEach((el: string) => {
          //Multiple Queue Items
          let tmp = el.split("/");
          console.log(tmp.length)
          console.log(tmp[1] + " " + tmp[2] + " " + tmp[0])
          this.queueArray.push(new queueItem(tmp[1], tmp[2], tmp[0]));
        });
      }else if(response.includes("/")){
        //1 Queue Item
        let tmp = response.split("/");
        this.queueArray.push(new queueItem(tmp[1], tmp[2], tmp[0]));
      }
    });
  }
}