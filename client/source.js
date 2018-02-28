    //handle server response
    const handleResponse = (xhr, parseResponse) => {
      const content = document.querySelector('#content');
      const consoleStandin = document.querySelector('#consoleStandin');

      switch(xhr.status) {
        case 200: //success
          consoleStandin.innerHTML = `<b>Success</b>`;
          break;
        case 201: //created content
          consoleStandin.innerHTML = '<b>Create</b>';
          break;
        case 204: //updated existing content
          consoleStandin.innerHTML = '<b>Updated (No Content)</b>';
          break;
        case 400: //bad request
          consoleStandin.innerHTML = `<b>Bad Request</b>`;
          break;
        case 404: //not found
          consoleStandin.innerHTML = `<b>Resource Not Found</b>`;
          break;
        default: //catchall
          consoleStandin.innerHTML = `Error code not implemented by client.`;
          break;
      }
      
      
      //expecting a body
      if(parseResponse) {
        const obj = JSON.parse(xhr.response);
        console.dir(obj);
        
        if(obj.message) {
          const p = document.createElement('p');
          p.textContent = `Message: ${obj.message}`;
          consoleStandin.appendChild(p);
        }
        
        //if editing
        if(obj.inputValues) {
          console.dir(`Editing values`);
          const loading = obj.inputValues;
          
          //get the field objects
          const nameField = charForm.querySelector('#nameField');
          const raceField = charForm.querySelector('#raceField');
          const classField = charForm.querySelector('#classField');
          const alignFieldH = charForm.querySelector('#alignFieldH');
          const alignFieldV = charForm.querySelector('#alignFieldV');
          const portraitField = charForm.querySelector('#portraitUrl');
          const strField = charForm.querySelector('#str');
          const dexField = charForm.querySelector('#dex');
          const conField = charForm.querySelector('#con');
          const intField = charForm.querySelector('#int');
          const wisField = charForm.querySelector('#wis');
          const chaField = charForm.querySelector('#cha');
          
          
          //load in the character's values and handle possible missing pieces
          nameField.value = loading.name;
          raceField.value = loading.race;
          classField.value = loading.class;
          const alignArr = loading.alignment.split(' ');
          if (loading.alignment === 'True Neutral'){
            alignFieldH.value = 'Neutral';
            alignFieldV.value = alignArr[1];
          } else{
            alignFieldH.value = alignArr[0];
            alignFieldV.value = alignArr[1];
          }
          portraitField.value = loading.portraitUrl;
          if (!portraitField){
           portraitField.value = ''; 
          }
          strField.value = loading.strength;
          dexField.value = loading.dexterity;
          conField.value = loading.constitution;
          intField.value = loading.intelligence;
          wisField.value = loading.wisdom;
          chaField.value = loading.charisma;
          
        };
        
        //if characters
        if(obj.characters) {
          content.innerHTML = '';
          const charList = document.createElement('div');
          charList.id = "characterContainer";
          
          //place object keys in an array for iteration
          const getObjKeys = Object.keys(obj.characters);
          console.dir(getObjKeys);
          
          
          //loop through characters and generate character panels
          for(let i=0; i < getObjKeys.length; i++){
            
            const charGrab = obj.characters[getObjKeys[i]];
            console.dir(`Loading ${charGrab.name}...`);
            
            const panel = document.createElement('section');
            panel.setAttribute("class", "characterPanel");
            
            const port = document.createElement('img');
            port.setAttribute("class", "port");
            port.src = charGrab.portraitUrl;
            panel.appendChild(port);
            
            const nameP = document.createElement('h2');
            nameP.textContent = charGrab.name;
            panel.appendChild(nameP);
            
            const typeP = document.createElement('p');
            typeP.setAttribute("class", "info");
            typeP.textContent = `${charGrab.race} ${charGrab.class}`;
            panel.appendChild(typeP);
            
            const alignP = document.createElement('p');
            alignP.setAttribute("class", "info");
            alignP.textContent = charGrab.alignment;
            panel.appendChild(alignP);
            
            const statsSec = document.createElement('section');
            statsSec.setAttribute("class", "stats");
              
              const strP = document.createElement('p');
              strP.setAttribute("class", "stat");
              strP.textContent = `STR: ${charGrab.strength}`;
              statsSec.appendChild(strP);
              const dexP = document.createElement('p');
              dexP.setAttribute("class", "stat");
              dexP.textContent = `DEX: ${charGrab.dexterity}`;
              statsSec.appendChild(dexP);
              const conP = document.createElement('p');
              conP.setAttribute("class", "stat");
              conP.textContent = `CON: ${charGrab.constitution}`;
              statsSec.appendChild(conP);
              const br = document.createElement('br');
              statsSec.appendChild(br);
              const intP = document.createElement('p');
              intP.setAttribute("class", "stat");
              intP.textContent = `INT: ${charGrab.intelligence}`;
              statsSec.appendChild(intP);
              const wisP = document.createElement('p');
              wisP.setAttribute("class", "stat");
              wisP.textContent = `WIS: ${charGrab.wisdom}`;
              statsSec.appendChild(wisP);
              const chaP = document.createElement('p');
              chaP.setAttribute("class", "stat");
              chaP.textContent = `CHA: ${charGrab.charisma}`;
              statsSec.appendChild(chaP);
            panel.appendChild(statsSec);
            
            //add edit button
            const editButton = document.createElement('form');
            editButton.setAttribute("id", `editButton${charGrab.name}`);
            editButton.setAttribute("action", `/load?name=${charGrab.name}`);
            editButton.setAttribute("method", "get");
              const editSubmit = document.createElement('input');
              editSubmit.setAttribute("type", "submit");
              editSubmit.setAttribute("value", "Edit Character");
            editButton.appendChild(editSubmit);
            panel.appendChild(editButton);
                        
            //add panel to container
            charList.appendChild(panel);                       
          }
          
          
          //add container to page
          content.appendChild(charList);
          
          //loop one more time to hook up buttons now that they exist
          for(let i=0; i < getObjKeys.length; i++){
            const charGrab = obj.characters[getObjKeys[i]];
            
            const grabEdit = document.querySelector(`#editButton${charGrab.name}`);
            const editAChara = (e) => requestUpdate(e, grabEdit.action);
            grabEdit.addEventListener('submit', editAChara);
          }
        }
      } else {
        console.log('received');
      }
    };
        
    
    
    //function to send POST
    const sendPost = (e, charForm) => {
      //get action and method
      const formAction = charForm.getAttribute('action');
      const formMethod = charForm.getAttribute('method');
      
      //get the field objects
      const nameField = charForm.querySelector('#nameField');
      const raceField = charForm.querySelector('#raceField');
      const classField = charForm.querySelector('#classField');
      const alignFieldH = charForm.querySelector('#alignFieldH');
      const alignFieldV = charForm.querySelector('#alignFieldV');
      const portraitField = charForm.querySelector('#portraitUrl');
      const strField = charForm.querySelector('#str');
      const dexField = charForm.querySelector('#dex');
      const conField = charForm.querySelector('#con');
      const intField = charForm.querySelector('#int');
      const wisField = charForm.querySelector('#wis');
      const chaField = charForm.querySelector('#cha');
      
      //AJAX request
      const xhr = new XMLHttpRequest();
      xhr.open(formMethod, formAction);
      
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader ('Accept', 'application/json');
      
      xhr.onload = () => handleResponse(xhr, true);
      
      //build data
      const formData = `name=${nameField.value}&race=${raceField.value}&class=${classField.value}&alignment=${alignFieldH.value} ${alignFieldV.value}&portrait=${portraitField.value}&str=${strField.value}&dex=${dexField.value}&con=${conField.value}&int=${intField.value}&wis=${wisField.value}&cha=${chaField.value}`;
      console.log(`sent post ${formData}`);
      
      //send request with data
      xhr.send(formData);
      
      requestUpdate(e, "/getChars");
      
      //prevent browser default
      e.preventDefault();
      return false;      
    };

   //function to send request
    const requestUpdate = (e, gotoUrl) => {
      
      //grab fields 
      const url = gotoUrl;
      const method = "get";
      
      //create a new AJAX request (asynchronous)
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('Accept', 'application/json');

      //check for get or head
      if(method == 'get') {
        xhr.onload = () => handleResponse(xhr, true);
      } else {
        xhr.onload = () => handleResponse(xhr, false);
      }
      
      //send ajax request
      xhr.send();
      
      //cancel browser default
      e.preventDefault();
      return false;
    };
  
  
    const editCharaRequest = (e, params) => {
      requestUpdate(e, params);
      
      //cancel browser default
      e.preventDefault();
      return false;
    };

  
    //init
    const init = () => {
      //get the forms
      const charaForm = document.querySelector('#charForm');
      const getForm = document.querySelector('#getForm');
      
      //handle request
      const addChara = (e) => sendPost(e, charaForm);
      const getChars = (e) => requestUpdate(e, "/getChars");

      
      //event listeners
      charaForm.addEventListener('submit', addChara);
      getForm.addEventListener('submit', getChars);
      
    };
    
    window.onload = init;
    