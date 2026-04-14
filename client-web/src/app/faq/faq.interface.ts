export interface DirectusFaqItem {
  category: string;
  question: string;
  answer: string;
}

export interface DirectusFaqResponse {
  data: DirectusFaqItem[];
}

export interface FAQCategoryInterface {
  categoryName: string;
  faqs: Pick<DirectusFaqItem, 'question' | 'answer'>[];
}
