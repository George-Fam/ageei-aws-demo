import { Component, OnInit } from '@angular/core';
import { FAQCategory } from './faq-category';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  faqCategories: FAQCategory[];
  selectedCategory: FAQCategory;

  constructor() {
    this.faqCategories = [
      {
        categoryName: 'Photo de finissants',
        faqs: [
          {
            question: 'Quand ont lieux les photos de finissants ?',
            answer: 'À la fin de la session d’hiver (au mois de mai ou juin).',
          },
        ],
      },
      {
        categoryName: 'Party',
        faqs: [
          {
            question: 'Comment savoir quand et où ont lieu les party ?',
            answer:
              ' Nous produisons généralement des affiches une semaine ou deux avant les partys, et faisons des annonces sur nos canaux officiels. Vous pouvez vous référer à la section Contacts.',
          },
          {
            question: 'Comment savoir quand et où ont lieu les party ?',
            answer:
              ' Nous produisons généralement des affiches une semaine ou deux avant les partys, et faisons des annonces sur nos canaux officiels. Vous pouvez vous référer à la section Contacts.',
          },
        ],
      },
    ];
    this.selectedCategory = this.faqCategories[0];
  }

  ngOnInit(): void {}

  selectCategory(category: FAQCategory): void {
    this.selectedCategory = category;
  }
}
