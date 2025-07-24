import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';

// function to fetch the data from the api
const getData = async (apiUrl : string) => {
  try {
    const response = await fetch(apiUrl);
    const fetchedData = await response.json()
    return fetchedData;
  } catch (error) {
    console.log(error);
    return null;
  }
}
    
const Table = () => {
  const [tableItems, setTableItems] = useState([]);

  const handleFetchData = async () => {
    const response = await getData('https://api.artic.edu/api/v1/artworks?page=1');
    const fetchedData = response.data;
    // I am mapping only the required fields
    setTableItems(fetchedData.map((item: { 
      title: string; 
      place_of_origin: string; 
      artist_display: string; 
      inscriptions: string; 
      date_start: number; 
      date_end: number; 
    }) => {
      return {
        title: item.title,
        place_of_origin: item.place_of_origin,
        artist_display: item.artist_display,
        inscriptions: item.inscriptions,
        date_start: item.date_start,
        date_end: item.date_end,
      }
    }));
  }

  useEffect(()=>{
    handleFetchData();
  },[])

  return (
    <div>
      {
        <DataTable value={tableItems} tableStyle={{ minWidth: '50rem' }}>
          <Column field="title" header="Title" />
          <Column field="place_of_origin" header="Place of Origin" />
          <Column field="artist_display" header="Artist Display" />
          <Column field="inscriptions" header="Inscriptions" />
          <Column field="date_start" header="Date Start" />
          <Column field="date_end" header="Date End" />
        </DataTable>
      }
    </div>
  )
}

export default Table
