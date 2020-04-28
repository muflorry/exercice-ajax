// Fonction permettant d'afficher l'overlay
function setOverlay(){
    $('body').append(`
        <div class="overlay"><img src="img/ajax-loader.svg"></div>
    `);
}

// Fonction permettant d'enlever l'overlay
function removeOverlay(){
    $('.overlay').remove();
}

// Fonction permettant d'échapper du HTML(équivalent du htmlspecialchars PHP)
function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}


// Quand le formulaire est envoyé
$('form').submit(function(e){

    // Blocage redirection formulaire
    e.preventDefault();

    // Effacement du nombre de résultats
    $('.result').remove();

    let cityToSearch = $('.form-city').val();

    // Vérification que la recherche comporte au moins 1 caractère
    if(cityToSearch.length < 1){
        $('#view').html('<p class="red">Champ vide !</p>');
    } else {

        // Requête AJAX pour récupérer la liste des villes auprès de l'api geo de gouv.fr
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            dataType: 'json',
            data: $(this).serialize(),
            success: function(data){

                // Affichage du nombre de résultats
                if(data.length == 0){
                    $('form').after('<p class="result red">Résultat :0</p>')
                } else if(data.length == 1){
                    $('form').after('<p class="result green">Résultat :1</p>')
                } else{
                    $('form').after('<p class="result green">Résultats : ' + data.length + '</p>')
                }

                // Vérification qu'il y a bien des villes en résultat
                if(data.length == 0){
                    $('#view').html('<p class="red">Aucun résultat !</p>');
                } else{

                    // Création d'un tableu HTML
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
                            <tbody></tbody>
                        </table>`
                    );

                    //Pour chaque ville dans le tableau data (ville réçus via la requête AJAX), on crée un nouveau <tr> dans le tableau
                    data.forEach(function(city){

                        //Création de la <tr> de la voiture en cours
                        let newCityRow = $('<tr></tr>');

                        //Création du premier <td< contenant le nom de la ville
                        let newCityName = $('<td></td>');
                        newCityName.text(city.nom);

                        //Création du deuxième <td< contenant les codes postaux
                        let newCityZipcodes = $('<td></td>');

                        let zipCodesList = [];

                        city.codesPostaux.forEach(function(zipCode){
                            zipCodesList.push( escapeHtml(zipCode) );
                        });

                        newCityZipcodes.html( zipCodesList.join('<br>') );

                        //Création du troixième <td< contenant la population
                        let newCityPopulation = $('<td></td>');
                        newCityPopulation.text( city.population );

                        //Création du quatrième <td< contenant le code département
                        let newCityDepartmentCode = $('<td></td>');
                        newCityDepartmentCode.text( city.codeDepartement );

                        // Ajout des infos de la ville dans la ligne de la ville en cours
                        newCityRow.append( newCityName );
                        newCityRow.append( newCityZipcodes );
                        newCityRow.append( newCityPopulation );
                        newCityRow.append( newCityDepartmentCode );

                        //Insertion de la <tr> dans le <tbody> du tableau
                        citiesTable.find('tbody').append( newCityRow );
                    });

                    //Insertion du tableau dans la page, dans la div #view
                    $('#view').html( citiesTable );
                }

            },

            error: function(){
                // Si on rentre ici c'est qu'il y a eu un problème lors de la connexion au serveur de l'API
                $('#view').html('<p class="red">Problème de connexion au serveur !</p>');
            },

            beforeSend: function(){
                //Affichage de l'overlay
                setOverlay();
            },

            complete: function(){
                //Suppression de l'overlay
                removeOverlay();
            }

        });
    }

});