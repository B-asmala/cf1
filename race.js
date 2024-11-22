//const api = "https://codeforces.com/api/user.status?handle=";
const button = document.getElementById("go-button");
const table = document.getElementById("track-table");
const subsCount = 50;
const tilesCount = 20;
let streaks = {};
let heatmaps = {};


async function showRace(){
    const handles = getHandles(); //get array of handles entered
    try {
        if(!handles.length){
            alert("please enter handles first!")
        }else{
            table.innerHTML = "";

            button.disabled = true;
            button.style.backgroundColor = "gray"; 
            button.innerText = "---";

            streaks = {};
            heatmaps = {};
            
            let promises = handles.map(async (handle) => {
                await countDays(handle);
            });

            await Promise.all(promises); //wait for all of them while they execute concurrently


            //sort streaks non increasing
            streaks = Object.entries(streaks);
            streaks.sort((a, b) => b[1] - a[1]);
            console.log(streaks);
            //players dictionary has the info now
            buildTrack();

            button.disabled = false;
            button.style.backgroundColor = "red";
            button.innerText = "Go!";

        }

        

        



        
        
    } catch (error) {
        alert("problem with internet or codeforces is currently down");
        
    }


     

    
    
}



async function countDays(handle){
    try {
        heatmaps[handle] = new Array(tilesCount).fill(0);
        streaks[handle] = 0;
            
        
        let f = 1;
        let page = 0;
        let today = Math.floor(Date.now()/(1000 * 60 * 60 * 24));
        let di = today + 1;
        let d = 0;
        while(f || (today - d < tilesCount)) {
            let data = await getData(handle, (page * subsCount) + 1);
            if(data.result.length == 0)break;

            for(let i = 0; i < subsCount && i < data.result.length; i ++){
                d = Math.floor(data.result[i].creationTimeSeconds/(60 * 60 * 24));

                if(today - d < tilesCount){
                   heatmaps[handle][today - d] ++;
                }


                if(d == di - 1){
                    streaks[handle] ++;
                    di = d;
                }else{
                    f= 0;
                }
                 
            }
            
            
            
            page ++;

        }
        
        // console.log(streaks[handle]);
        // console.log(heatmaps[handle]);

        
        
    } catch (error) {
        throw error;
        
    }

}

async function getData(handle, page){
    try {
        const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=${page}&count=${subsCount}`);
        if (!response.ok) {
          throw new Error('please check your internet');
        }
        return response.json();  
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;  
      }
}


function buildTrack(){
    let tbody = document.createElement("tbody");
    let image, tr, td;
    let imgid;
    tbody.id = "track";
    for (let player of streaks) {
        //heatmap
        tr = document.createElement("tr");
        td = document.createElement("td");
        td.classList.add("heatmap-container");
        let divHeatmap = document.createElement("div");
        divHeatmap.classList.add("heatmap");
        for(let day of heatmaps[player[0]]){
            let divSquare = document.createElement("div");
            divSquare.classList.add("square");
            if(day == 0){
                divSquare.style.backgroundColor = `rgb(90, 90, 90)`;
            }else{
                divSquare.style.backgroundColor = `rgb(10, ${Math.max(256 - day * 25, 100)}, 10)`;
            }
            divHeatmap.appendChild(divSquare);
        }
        td.appendChild(divHeatmap);
        tr.appendChild(td);
        
        //car image
        td = document.createElement("td");
        td.classList.add("car-photo-container");
        image = document.createElement("img");
        image.classList.add("car-photo");
        
        if(player[1]){
            imgid = Math.floor(Math.random() * 10);
            image.src = `images/${imgid}.png`;
        }else{
            image.src = "images/loser.png";
        }
        image.alt = "race car";
        td.appendChild(image);
        tr.appendChild(td);

        //name
        td = document.createElement("td");
        td.classList.add("player-name");
        td.innerHTML = player[0];
        tr.appendChild(td);

        //score
        td = document.createElement("td");
        td.classList.add("score");
        if(player[1]){
            td.innerHTML = (player[1] + "🔥");
        }else{
            td.innerHTML = player[1];
        }
        tr.appendChild(td);


        tbody.appendChild(tr);
    }
    table.appendChild(tbody);

}


function getHandles(){
    const input = document.getElementById("handles-input");
    let inputArr = input.value;
    inputArr = inputArr.replace(/\s+/g, '').split(',').filter(i => i !== "");
    let handles = [];
    inputArr.forEach(handle => {
        if(!handles.includes(handle)){
            handles.push(handle);
        }
    });
    return handles;
}




