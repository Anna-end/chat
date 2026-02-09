export function saveDataUserLocalStorage(login: string): void{
    localStorage.setItem('login', login);
}

export function clearLocalStorage(): void {
    localStorage.clear()
}