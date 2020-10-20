function getAdults() {
  const users = [
    { name: 'Arun', age: 22 },
    { name: 'Suresh', age: 18 },
    { name: 'Ramesh', age: 15 },
    { name: 'Dinesh', age: 55 },
    { name: 'Aravind', age: 44 },
    { name: 'Vijay', age: 23 },
    { name: 'Santhosh', age: 33 },
  ]

  return users.filter((user) => user.age >= 18)
}

export { getAdults }
