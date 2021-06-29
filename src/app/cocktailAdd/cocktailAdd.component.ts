import { DOCUMENT } from '@angular/common';
import { newArray } from '@angular/compiler/src/util';
import { Component, Inject, OnInit } from '@angular/core';
import { } from 'jquery';
import { Console } from 'node:console';
import { element } from 'protractor';
import { CocktailQueueComponent } from '../cocktailQueue/cocktailQueue.component';

declare var $: any;


class inputObject {
  public ingredientName:string;
  public value:string;
  constructor(ingredientName:string, value:string) {
    this.ingredientName = ingredientName;
    this.value = value;
  }
}

@Component({
  selector: 'cocktailAdd',
  templateUrl: './cocktailAdd.component.html',
  styleUrls: ['./cocktailAdd.component.scss']
})
export class CocktailAddComponent implements OnInit{
  public CocktailIngredients : Array<string> = new Array<string>();

  public cocktailCreationVisible:boolean = true;
  public ingredientEditVisible:boolean = false;
  public ingredientEditNew:boolean = true;


  public newIngredientName: string = 'T';
  public newIngredientSlot: string = 'T';

  public inputValues : Array<inputObject> = new Array<inputObject>();

  public updateValues(name:string, event:any) {
    this.inputValues.forEach(el => {
      if(el.ingredientName == name) {
        el.value = event.target.value;
        return;
      }
    });
    this.inputValues.push(new inputObject(name, event.target.value))
  }

  public postCocktailCreation(cocktailName:any, cocktailCatergoy:any) {
    let cocktailData = "";
    if(cocktailName.includes("~") || cocktailCatergoy.includes("~")) {
      console.log("Character not allowed!")
      return
    }
    if(cocktailName.length > 2 && cocktailCatergoy.length > 2) {
      this.inputValues.forEach(element => {
        if(element.value.length > 0) {
          cocktailData += element.ingredientName + "$" + element.value + "~";
        }
      });
      if(cocktailData.length > 4) {
        $.post("http://5.230.70.236/api.php", {
          cocktailName: cocktailName,
          cocktailCatergoy: cocktailCatergoy,
          createCocktail: cocktailData.slice(0, -1)
        }, (response:any)=> {
          console.log("CocktailCreation: " + response)
          console.log(cocktailName, cocktailCatergoy, cocktailData.slice(0, -1))
          location.reload();
        })
      }
    }
  }

  ngOnInit() {
    this.getIngredients().then(async () => {
    })
  }

  public addIngredient(name:string, slot:string) {
    console.log(name, slot)

    $.post("http://5.230.70.236/api.php", {
        addIngredient: name,
        ingredientSlot: slot
    }, (response:string) => {
      console.log("IngredientAdd: " + response)
    })
    //location.reload()
  }

  public openNew() {
    this.ingredientEditNew = true;
  }

  public openDelete() {
    this.ingredientEditNew = false;
  }



  public deleteIngredient(item:any) {
    $.post("http://5.230.70.236/api.php", {
      delete: item
    }, (response:string) => console.log(response));
    location.reload()
  }

  public changeState() {
    this.cocktailCreationVisible = !this.cocktailCreationVisible;
    this.ingredientEditVisible = !this.ingredientEditVisible;
  }

  public async getIngredients() {
    //this.CocktailIngredients.splice(0, CocktailIngredients.length)

    $.post("http://5.230.70.236/api.php", {
      ingredients: "getIngredients"
    }, (response:string) => {
      //zucker/wasser/wodka/trollolol
      if(response.includes("~")) {
        response.split("~").forEach(el => {
          this.CocktailIngredients.push(el)
        });
      }else if(response.length > 0) {
        this.CocktailIngredients.push(response)
      }
    });
  }
}