import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Output() navigate = new EventEmitter<string>();
  @Output() openGame = new EventEmitter<string>();
  isCollapsed = false;

  constructor(private router: Router) {}

  nav(section: string) {
    this.navigate.emit(section);
  }

  goHome() {
    // Navega a /home (si ya estás en /home, con onSameUrlNavigation: 'reload' el evento se dispara)
    this.router.navigate(['/home']);
  }

    goNews() {
    // Navega a /home (si ya estás en /home, con onSameUrlNavigation: 'reload' el evento se dispara)
    this.router.navigate(['/news']);
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  @HostListener('window:resize')
  onResize() {
    this.isCollapsed = window.innerWidth < 768;
  }

  ngOnInit() {
    this.isCollapsed = window.innerWidth < 768;
  }
}
