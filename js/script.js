// Fonction permettant d'appliquer un overlay avec une icône de chargement sur toute la page
function setOverlay(){
    $('body').append(`
        <div class="overlay"><img src="img/ajax-loader.svg"></div>
    `);
}

// Fonction permettant de supprimer l'overlay appliqué par la fonction précédente
function removeOverlay(){
    $('.overlay').remove();
}

// Si le formulaire est envoyé
$('form').submit(function(e){

    // Blocage redirection formulaire
    e.preventDefault();

    let cityToSearch = $('.form-city').val();

    // Vérification que la recherche comporte au moins 1 caractère
    if(cityToSearch.length < 1){
        $('#view').html('<p class="red">Champ vide !</p>');
    } else {

        // Requête AJAX permettant d'envoyer les données qui nous retournera une réponse en JSON
        $.ajax({
            type: 'GET',
            url: 'https://geo.api.gouv.fr/communes/',
            dataType: 'json',
            data: $(this).serialize(),
            success: function(data){

                console.log(data);

                //Insertion des villes dans le block
                let citiesTable = $(`
                   <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Codes Postaux</th>
                                <th>Population</th>
                                <th>Département</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>`
                );

                //Pour chaque ville dans le tableau data (ville réçus via la requête AJAX), on crée un nouveau <tr> dans le tableau
                data.forEach(function(city){

                    //Création de la <tr> de la voiture en cours
                    let newCity = $('<tr></tr>');

                    //Création du premier <td< contenant la version protégée (.text) de la ville
                    let cityName = $('<td></td>');
                    cityName.text(city.nom);

                    //Création du deuxième <td< contenant la version protégée (.text) de la ville
                    let cityZipCodes = $('<td></td>');
                    cityZipCodes.text(city.codepostaux);

                    //Création du troixième <td< contenant la version protégée (.text) de la ville
                    let cityPopulation = $('<td></td>');
                    cityPopulation.text(city.population);

                    //Création du quatrième <td< contenant la version protégée (.text) de la ville
                    let cityDepartment = $('<td></td>');
                    cityDepartment.text(city.departement);

                    //Insertion des 4 <td> dans la <tr>
                    newCity.append(cityName);
                    newCity.append(cityCodePostaux);
                    newCity.append(cityPopulation);
                    newCity.append(cityDepartement);

                //Insertion de la <tr> dans le <tbody> du tableau
                citiesTable.find('tbody').append(newCity);
                });

            //Insertion du tableau dans la page, dans la div #view
            $('#view').html( citiesTable );
            },

            error: function(){
                $('#view').html('<p class="red">Problème de connexion</p>');
            },

            beforeSend: function(){
                setOverlay();
            },

            complete: function(){
                removeOverlay();
            }

        });
    }

});