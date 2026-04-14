import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DirectusFaqResponse, FAQCategoryInterface } from './faq.interface';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  private http = inject(HttpClient);

  getFaqs(): Observable<FAQCategoryInterface[]> {
    return this.http.get<DirectusFaqResponse>(environment.faqUrl).pipe(
      map(({ data }) => {
        const categoryMap = new Map<string, FAQCategoryInterface>();

        for (const item of data) {
          const existing = categoryMap.get(item.category);

          if (existing) {
            existing.faqs.push({
              question: item.question,
              answer: item.answer,
            });
          } else {
            categoryMap.set(item.category, {
              categoryName: item.category,
              faqs: [{ question: item.question, answer: item.answer }],
            });
          }
        }
        return Array.from(categoryMap.values());
      })
    );
  }
}
