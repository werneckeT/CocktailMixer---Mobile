import { newArray } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { DxResponsiveBoxComponent } from 'devextreme-angular';
import { } from 'jquery';
import { element } from 'protractor';

declare var $: any;

class cocktail {
  public _cocktail_name;
  public _cocktail_class;

  constructor(cocktail_name:string, cocktail_class:string) {
    this._cocktail_name = cocktail_name;
    this._cocktail_class = cocktail_class;
  }
}

class ingredientWithAmount {
  public ingredient_name:string;
  public ingredient_amount:string;
  constructor (ingredient_name:any, ingredient_amount:any) {
    this.ingredient_amount = ingredient_amount;
    this.ingredient_name = ingredient_name;
  }
}

class cocktail_detailed {
  public name:string;
  public category:string;
  public ingredients:ingredientWithAmount[] = new Array<ingredientWithAmount>();
  public ready:boolean = false;

  constructor ({ name, catergory }: { name: string; catergory: string; }) {
    this.name = name;
    this.category = catergory;
    this.getIngredients(name).then(async() => {
      this.ready = true;
    })
  }

  private async getIngredients(cocktailName:string) {
    $.post("http://5.230.70.236/api.php", {
      getIngredientsForCocktail : cocktailName
    }, (response:any) => {
      console.log(response)
      if(response.includes("~")) {
        response.split("~").forEach((element:any) => {
          let i = new ingredientWithAmount(element.split("$")[0], element.split("$")[1])
          this.ingredients.push(i)
        });
      }else if(response.length > 0) {
        let i = new ingredientWithAmount(response.split("$")[0], response.split("$")[1])
        this.ingredients.push(i)
      }
    })
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cccocktail';
  cocktailArray: Array<cocktail> = new Array<cocktail>();
  cocktailCategories: Array<{name: string, items: cocktail[]}> = new Array<{name: string, items: cocktail[]}>();
  public listVisible:boolean = false;
  public addVisible:boolean = false;
  public mainScreen:boolean = true;

  public currentDetailCocktail!: cocktail_detailed;

  public openList() {
    this.listVisible = true;
  }

  public openAdd() {
    this.addVisible = true;
  }

  constructor() 
  {
  }

  public newCocktail(name:any) {
    $.post("http://5.230.70.236/api.php", {
      addCocktailToQueue : name,
      size: "default"
    }, (response:any) => {
      console.log(response)
    });
    location.reload()
  }

  private getCatergory(cocktailName:string) {
    this.cocktailArray.forEach((element:any) => {
      if(element._cocktail_name == cocktailName) {
        return element._cocktail_class
      }
    });
    return null
  }

  public openCocktail(cocktail:any) {
    let category = this.getCatergory(cocktail)
    //if(category != null) {
      this.currentDetailCocktail = new cocktail_detailed({ name: cocktail, catergory: "undefined" })
      this.mainScreen = false;
    //}else {
      //console.warn("Could not gather Cocktail Catergory!")
    //}
  }

  ngOnInit() {
    this.getCocktails().then( async () => {
      //console.log(this.cocktailCategories)
    });
  }
  public async getCocktails() {
    $.post("http://5.230.70.236/api.php", {
      data: "getCocktails"
    }, (response:any) => {
      /*
      
      ITEM/CLASS % ITEM/CLASS

      */

      response.split("%").forEach((el:string) => {

        if(!(this.cocktailCategories.length === 0)) {
          let used = false;
          this.cocktailCategories.forEach(element => {
            if(element.name == el.split("/")[1]) {
              element.items.push(new cocktail(el.split("/")[0], el.split("/")[1]))
              used = true;
            }
          });
          if(!used) {
            this.cocktailCategories.push( { name: el.split("/")[1], items: new Array(new cocktail(el.split("/")[0], el.split("/")[1])) } )
          }
        }else {
            this.cocktailCategories.push( { name: el.split("/")[1], items: new Array(new cocktail(el.split("/")[0], el.split("/")[1])) } )
        }

        
        //this.cocktailArray.push(new cocktail(el.split("/")[0], el.split("/")[1]));
      });
      
     //console.log(this.cocktailCategories)
    });
  }
}