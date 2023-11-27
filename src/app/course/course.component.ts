import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  catchError,
  finalize,
} from "rxjs/operators";
import { merge, fromEvent, Observable, throwError } from "rxjs";
import { Lesson } from "../model/lesson";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.scss"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course: Course;
  lessons: Lesson[] = [];
  loading = false;
  expandedLesson: Lesson = null;

  @ViewChild(MatPaginator)
  matPaginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;


  displayedColumns = ["seqNo", "description", "duration"];

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
  ) {}

  ngOnInit() {
    this.course = this.route.snapshot.data["course"];
    this.loadLessonsPage();
  }

  loadLessonsPage() {
    this.loading = true;

    this.coursesService
      .findLessons(
        this.course.id,
        // "asc",
        this.sort?.direction ?? "asc",
        // 0,
        this.matPaginator?.pageIndex ?? 0,
        // 3
        this.matPaginator?.pageSize ?? 3,
        this.sort?.active ?? "seqNo",
      )
      .pipe(
        tap((lessons) => (this.lessons = lessons)),
        catchError((err) => {
          console.log("Loading Error", err);
          alert("Loading Error");
          return throwError(err);
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.matPaginator.pageIndex = 0));

    merge(this.sort.sortChange, this.matPaginator.page)
      .pipe(tap(() => this.loadLessonsPage()))
      .subscribe();
  }

  onToggleLesson(lesson: Lesson) {
    if (this.expandedLesson == lesson) {
      console.log(this.expandedLesson);
      this.expandedLesson = null;
    } else {
      console.log(this.expandedLesson);
      this.expandedLesson = lesson;
    }
  }
}
