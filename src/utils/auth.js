export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

export const logout = () => {
    let token = getCookie('token');

    try{
        let response = fetch('https://zgrzyt-anfebba8dtfdcrd8.polandcentral-01.azurewebsites.net/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if(response.status === 200){
            document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "current_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "current_user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "current_user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            alert('Wylogowano pomyślnie');
        }else if(response.status === 401){
            console.log('Brak autoryzacji nie można wylogować')
        }

        window.location.href = '/';
    }catch (error) {
        console.error(error);
    }

};