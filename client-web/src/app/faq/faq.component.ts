import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FAQCategoryInterface } from './faq.interface';
import { FaqService } from './faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  standalone: false,
})
export class FaqComponent implements OnInit {
  faqCategories: FAQCategoryInterface[] = [];
  selectedCategory: FAQCategoryInterface | null = null;
  private faqService = inject(FaqService);

  constructor() {
    inject(Title).setTitle('AGEEI - FAQ');
    const meta = inject(Meta);
    const desc = "Réponses aux questions fréquentes des étudiants en informatique de l'UQAM.";
    meta.updateTag({ name: 'description', content: desc });
    meta.updateTag({ property: 'og:title', content: 'AGEEI - Foire aux questions' });
    meta.updateTag({ property: 'og:description', content: desc });
    meta.updateTag({ property: 'og:url', content: 'https://ageei.org/faq' });
    meta.updateTag({ property: 'og:image', content: 'https://ageei.org/assets/logo.png' });
  }
  ngOnInit(): void {
    this.faqService.getFaqs().subscribe((categories) => {
      this.faqCategories = categories;
      this.selectedCategory = categories[0] ?? null;
    });
  }

  selectCategory(category: FAQCategoryInterface): void {
    this.selectedCategory = category;
  }
}
