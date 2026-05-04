import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { FAQCategoryInterface } from './faq.interface';
import { FaqService } from './faq.service';

interface FaqSearchResult {
  categoryName: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  standalone: false,
})
export class FaqComponent implements OnInit {
  faqCategories: FAQCategoryInterface[] = [];
  selectedCategory: FAQCategoryInterface | null = null;
  searchControl = new FormControl('');
  searchResults: FaqSearchResult[] = [];
  isLoading = true;
  hasError = false;
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
    this.isLoading = true;
    this.hasError = false;
    this.faqService.getFaqs().subscribe({
      next: (categories) => {
        this.faqCategories = categories;
        this.selectedCategory = categories[0] ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      },
    });

    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe((query) => {
      this.filterFaqs(query ?? '');
    });
  }

  selectCategory(category: FAQCategoryInterface): void {
    this.selectedCategory = category;
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  get isSearching(): boolean {
    return !!this.searchControl.value?.trim();
  }

  private filterFaqs(query: string): void {
    const q = query.trim().toLowerCase();
    if (!q) {
      this.searchResults = [];
      return;
    }
    this.searchResults = this.faqCategories.flatMap((cat) =>
      cat.faqs
        .filter((faq) => faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q))
        .map((faq) => ({ categoryName: cat.categoryName, question: faq.question, answer: faq.answer }))
    );
  }
}
