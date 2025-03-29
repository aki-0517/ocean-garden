export interface Position {
  x: number
  y: number
}

export interface ThemeAnimal {
  icon: any
  icon2: any
  id: string
  name: string
  image: string
  position: Position
  level: number
  maxLevel: number
}

export interface Project {
  id: string
  name: string
  progress: number
  level: number
  maxLevel: number
  themeAnimal: ThemeAnimal
  targetTransactions: number
  currentTransactions: number
  accentColor: string
}

