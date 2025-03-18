export interface Plan {
  id: number
  priorityLevel: number
  duration: number
  price: number
}

export interface PurchaseHistory {
  id: string
  postId: string
  planId: number
  plan: Plan
  startDate: string
  endDate: string
}
