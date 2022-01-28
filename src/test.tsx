let name: string = 'John';
let age: number = 25;
let isMarried: boolean = false;
let hobbies: string[] = ['Sports', 'Cooking','jkj'];
let address: [string, number] = ['Street', 99,];

type Person = {
  name: string;
  age: number;
}

type Person2 = Person& {
  gender: string;
}



let person: Person = {
name: 'John',
age: 25,
};

let person2:Person2={
name: 'Mary',
age: 25,
gender: 'mals'
}

const printNmae= (name: string) => {
console.log(name)
}

printNmae('John');