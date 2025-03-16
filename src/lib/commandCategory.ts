export type Category = '일반' | '채팅'
export type CategoryByEnglish = 'generals' | 'chattings'

export function getCategory(category: CategoryByEnglish): Category {
  switch (category) {
    case 'generals':
      return '일반'
    case 'chattings':
      return '채팅'
  }
}
