import { UserComponent } from "./app/user/user.component";
import { UserService } from "./app/user/user.service";


// FORM FOR CREATING A USER

const Userform = document.querySelector("form");

if (Userform) { // Check if Userform is not null
  Userform.addEventListener("submit", (event) => { 
    event.preventDefault(); // Prevent the form from submitting

    const firstNameInput = document.getElementById("firstName") as HTMLInputElement;
    const lastNameInput = document.getElementById("lastName") as HTMLInputElement;
    const userNameInput = document.getElementById("userName") as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;

    const newUser = UserService.newUser(firstNameInput.value, lastNameInput.value, userNameInput.value, emailInput.value, passwordInput.value);
  });
}