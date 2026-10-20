export interface SavedCard {
  id: string;
  cardholderName: string;
  cardNumber: string;
  rawLast4: string;
  expiry: string;
  cardType: 'Visa' | 'Mastercard';
  isDefault: boolean;
  createdAt?: string;
}

export interface SaveCardPayload {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  isDefault?: boolean;
}

export interface CardsResponse {
  statusCode: number;
  message: string;
  data: SavedCard[];
}

export interface SingleCardResponse {
  statusCode: number;
  message: string;
  data: SavedCard;
}
