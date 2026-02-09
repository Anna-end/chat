export function saveDataUserLocalStorage(login: string, id: string): void{
    localStorage.setItem('user_login', login);
    localStorage.setItem('user_auth_token', id)

}

export function clearLocalStorage(): void {
    localStorage.clear()
}

export function checkDataLocalStorage(): boolean {
    const user = localStorage.getItem('login');
    if (!user) {
        return false
    }
    return true
}