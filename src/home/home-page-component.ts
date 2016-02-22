import {Component, Inject, OnInit} from "angular2/core";
import {COMMON_DIRECTIVES} from "angular2/common";
import {UpperCasePipe} from "./upper-case-pipe";
import {Http} from "angular2/http";

@Component({
    selector: "home",
    directives: <any>[COMMON_DIRECTIVES],
    pipes: <any>[UpperCasePipe],
    templateUrl: "src/home/home-page.html"
})
export class HomePageComponent implements OnInit {
    colors;

    private http:Http;

    constructor(@Inject(Http)http:Http) {
        this.http = http;
    }

    ngOnInit() {
        this.http.get("api-mock/colors.json").subscribe(data => this.colors = data.json());
    }
}
