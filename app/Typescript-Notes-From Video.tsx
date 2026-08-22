


// -----------------------------------------------------------------------------------------------------------------
//                  (FUNCTIONS WITH TYEPSCIRPT)   At 1:07:47 -- Starts explaining Functions with Typecript 
// -----------------------------------------------------------------------------------------------------------------

// Note to self uncomment the code and hover to see the types/info/errors :)

// -- In function we have to sepcify the type of the params as typescript will immediately start complaining 
// function sayHi(name){
//     console.log(`Hello there ${name}`);
// };

// -- In this we can resolve this by either using  -- any  
// function sayHi(name: any){
//     console.log(`Hello there ${name}`);
// };

// -- OR changing the strict in the tsconfig file 

// -- OR the best case specifying the proper type 
// function sayHi(name: string){
//     console.log(`Hello there ${name}`);
// };

// with the specified type we can perform functions according to that specified type and if we add params/args more than 
// the specified amount of params/args or the wrong type it will complain about errors 

// function sayHi(name: string){
//     console.log(`Hello there ${name.toUpperCase()}`);
// };
// sayHi("Jhon Doe");          // Will print this to uppercase as we have the specified type function (string) on it
// sayHi("Jhon Doe", "Alice"); // Will cause error as we are giving (two) arguments more than than the specified arguments (one)
// sayHi(10);                  // Will cause error as the given type (number) is not according to the specified tyep (string)


// Tyepscript infers the type of function returen if we do not infer it, hover to see 
// function calculateDiscount(price: number){
//     return price * 10;
// };
// calculateDiscount(10);

// But we can explictly specify the type of return of function
// By applying the :type for example :number or :string we specify the type of return of the function
// SIDE NOTE: A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value.
// It can be helpful as if we forget and return the wrong type it will complain

// Hover over the return of if, it will complaing that string return is not assingable to number return type
// function calculateDiscount(price: number): number{

//     const hasDiscount = true
//     if(hasDiscount){
//         return "The discount is applied";
//     };

//     return price * 10;
// };
// calculateDiscount(10);



// ------------------------------------------------------------------------------------------------------------------------
//  (OPTIONAL & DEFAULT PARAMETERS IN FUNCTIONS)   At 1:23:24 -- Starts explaining optional & default params in functions
// -------------------------------------------------------------------------------------------------------------------------

// DIFFERNCE BETWEEN THE TWO PROVIDED AT THE END OF THIS SECTION


// As you can see that we can used ? with discount which makes that param optional in our case the discount param is now optional
// but if the optional param is being used in the function and we do not provide it's value then we must provide a fall back value
// in our case we used 0 i.e (discount || 0) if discount is given it is used other wise we use 0 in it's place

// function calculatePrice(price: number, discount?: number): number {
//     return price - (discount || 0);  // We have setup this logic in case of optional value
// };

// let priceAfterDiscount = calculatePrice(100);     // Did not provide the discount value as it is optional and fallback 0 will be used
// let priceAfterDiscount = calculatePrice(100, 20); // Provided the discount value i.e (20) so it will be used


// As you can see the we have written = 0 after the param i.e penaltyScore: number = 0 OR penaltyScore = 0 which makes/gives it a
// default value, if we do not provide any value the default value i.e 0 will used 

// function calculateScore(initialScore: number, penaltyScore: number = 0): number {
//     return initialScore - penaltyScore;
// };

// let scoreAfterPenalty = calculateScore(100, 20); // Provided penaltyScore param value so it will be used
// let scoreAfterPenalty = calculateScore(100);     // Did not provide the penaltyScore param value so default value 0 will be used


// The DIFFERENCE between optional and default param is that in case of optional value that is used we have to provide/setup a
// fallback value to be used while in the case of default param value we do not have to setup/provide a fallback value as the
// default value will be used 


// ------------------------------------------------------------------------------------------------------------------------
//                 (REST PARAMETERS IN FUNCTIONS)   At 1:28:28 -- Starts explaining rest params in functions
// -------------------------------------------------------------------------------------------------------------------------

// rest params are similarly used in typescript like in javascript (duh), when we have a number of prams we use rest params
// i.e ...(name of params) which is treated as a array and in typescript we have to write the type after it i.e :number[]

// function sum(message: string, ...digits:number[]):string {
//     const double = digits.map((dig)=> dig *2);
//     console.log(double);

//     let total = digits.reduce((previous, current) => {
//         return previous + current;
//     }, 0);

//     return `${message}${total}`;
// };

// const result = sum("This is a mesage", 1,2,3,4,5);
// console.log(result);


// ------------------------------------------------------------------------------------------------------------------------
//                 (VOID RETURN TYPE FUNCTIONS)   At 1:34:35 -- Explains void type return in function
// ------------------------------------------------------------------------------------------------------------------------

// void is a special type, it indicates the absence of a value, when used for a function it tells that the function will not
// return any kind of value, as you can see typescript complains that Type 'string' is not assignable to type 'void'.

// function logMessage(message: string):void{
//     console.log(message);

//     return ("message");
// };

// logMessage("Log this message");


// Using the union type i.e number or string we first have to confirm/check that output or process is according to that type
// This is called type guard

// function processValue(value: number | string){

//     // Type guard --  if the input is number
//     if(typeof value === 'number'){
//         console.log(value * 10);
//     };

//     // Type guard -- if the input is string
//     if(typeof value === 'string'){
//         console.log(value.toUpperCase());
//     };
    
// };

// processValue(10);
// processValue('Some text');



// ------------------------------------------------------------------------------------------------------------------------
//     (OBJECT TYPE PARAMS & RETURN TO FUNCTIONS)   At 1:40:00 -- Explains object type params and return to the function
// ------------------------------------------------------------------------------------------------------------------------

// Pretty straigh forward and self explanatory maybe paractice and use it and you will get the giest
// Passing the id object as params and returning object with id and isActive with isActive is calculated by % value by 2 if
// equal then true otherwise false

// function createEmployee({ id }: { id: number }): {id: number, isActive: boolean}{
//     return {id, isActive: id % 2 == 0 };
// };

// createEmployee({id: 12});


// ALTERNATIVE

// IMPORTANT NOTE, as you can see when we are referencing object i.e newStudent and if we add a additional value that we didn't 
// specify in the params typescript will not complain as it will only check for the values specified in the params and if those 
// values are not given it will complain

// Meanwhile if we give the inline object and in it we give a additional value which is not specified in the params tyepscript
// will complain as with inline we give/have complete control (Hover over to see the error)

// function createStudent(student: { id:number; name:string}): void{
//     console.log(`Welcome student ${student.name}`);
// };

// // Referncing Object
// const newStudent = {
//     id: 1,
//     name: "Ahmad",
//     email: "ahmad@gamil.com",
// };

// createStudent(newStudent);  // Referencing object
// createStudent({ id:1, name: "Ali", email: "ali@gmail.com"}); // Inline object



// ------------------------------------------------------------------------------------------------------------------------
//      IMPORTANT               (ALIAS & INTERFACE)   At 1:55:14 -- Explains alias & interface
// ------------------------------------------------------------------------------------------------------------------------

// A type alias is a new or shorthand for a existing type

// LEFT VIDEO AT 1:58:04 