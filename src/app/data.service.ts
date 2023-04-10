import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  getData(){
    return {
      "name":"Root-Node-ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      "children":
      [
          {
          "name":"Decision-Node",
          "rule":"Yes",
          "children":
          [
              {
              "name":"Leaf Node",
              "rule":"Yes"
              },
              {
                  "name":"Decision Node",
                  "rule":"No",
                  "children":
                  [
                      {
                      "name":"Leaf Node",
                      "rule":"Yes"
                      },
                      {
                          "name":"Leaf Node",
                          "rule":"Yes"
                          }
                  ]
              }
          ]
      },
      {
          "name":"Decision Node",
          "rule":"No",
          "children":
          [
              {
              "name":"Leaf Node",
              "rule":"Yes"
              },
              {
                  "name":"Leaf Node",
                  "rule":"Yes"
                  }
          ]
      }
      ]
  }
  }
}
