
export const getRouteByRole = (role: string) => {
  console.log('Current role:', role);
  switch (role) {
  case 'Центр Управления Полётами': return '/admin';
  case 'Командир Экипажа': return '/commander';
  case 'Бортовой Инженер': return '/engineer';
  case 'Космонавт': return '/astronaut';
  case 'Наземный Персонал': return '/ground';
  default: return '/';
  }
};