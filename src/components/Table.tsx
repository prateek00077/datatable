import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { Paginator, type PaginatorPageChangeEvent } from 'primereact/paginator';

    
const Table = () => {
  const [tableItems, setTableItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState<any>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);

  // function to fetch the data from the api
  const getData = async (page : number) => {
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      const fetchedData = await response.json()
      setTotalRecords(fetchedData.pagination.total);
      return fetchedData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  const handleFetchData = async () => {
    const response = await getData(page);
    const fetchedData = response.data;

    // I am mapping only the required fields

    setTableItems(fetchedData.map((item: { 
      id: number;
      title: string; 
      place_of_origin: string; 
      artist_display: string; 
      inscriptions: string; 
      date_start: number; 
      date_end: number; 
    }) => {
      return {
        id: item.id,
        title: item.title,
        place_of_origin: item.place_of_origin,
        artist_display: item.artist_display,
        inscriptions: item.inscriptions,
        date_start: item.date_start,
        date_end: item.date_end,
      }
    }));
  }

  // making this function to to save the ids of the selected items so taht it will persist
  // even after  teh page is refreshed

  const handleSelectionChange = (e: any) => {
    const selectedItems = e.value;
    setCheckedItems(selectedItems);

    if(selectedItems && selectedItems.length > 0) {
      const selectedIds = selectedItems.map((item: any) => item.id);
      localStorage.setItem('selectedIds', JSON.stringify(selectedIds));
    } else {
      localStorage.removeItem('selectedIds');
    }
  }

  const handlePageChange = (e : PaginatorPageChangeEvent) => {
    setPage(e.first);
    handleFetchData();
  }

  useEffect(()=>{
    handleFetchData();
  },[])

  // In this useEffect I will restore the checked items from local storage
  useEffect(()=>{
    const savedIds = localStorage.getItem('selectedIds');
    if(savedIds) {
      const selectedIds = JSON.parse(savedIds);
      const restoreSelectedItems = tableItems.filter((item: any) => selectedIds.includes(item.id));
      setCheckedItems(restoreSelectedItems);
    }
  },[tableItems])

  return (
    <>
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-x-auto">
        <DataTable value={tableItems}
          selection={checkedItems}
          onSelectionChange={handleSelectionChange} 
          tableStyle={{ minWidth: '50rem' }}
          dataKey="id"
          className="min-w-full"
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>

          <Column field="title" header="Title" />
          <Column field="place_of_origin" header="Place of Origin" />
          <Column field="artist_display" header="Artist Display" />
          <Column field="inscriptions" header="Inscriptions" />
          <Column field="date_start" header="Date Start" />
          <Column field="date_end" header="Date End" />
        </DataTable>
      </div>
    </div>
    <div className="flex justify-center items-center py-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow px-4 py-2">
        <Paginator first={page} rows={12} totalRecords={totalRecords} onPageChange={handlePageChange} className="" />
      </div>
    </div>
    </>
  )
}

export default Table
