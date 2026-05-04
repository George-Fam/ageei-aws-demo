import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
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
  private faqService = inject(FaqService);

  constructor() {
    inject(Title).setTitle('AGEEI - FAQ');
  }

  ngOnInit(): void {
    this.faqService.getFaqs().subscribe((categories) => {
      this.faqCategories = categories;
      this.selectedCategory = categories[0] ?? null;
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
