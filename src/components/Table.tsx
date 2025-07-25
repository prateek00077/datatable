import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState, useRef } from 'react';
import { Paginator, type PaginatorPageChangeEvent } from 'primereact/paginator';
import { OverlayPanel } from 'primereact/overlaypanel';
import 'primeicons/primeicons.css';
        

const Table = () => {
  const [tableItems, setTableItems] = useState<any[]>([]);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tocheck, setTocheck] = useState<number>(0);

  // function to fetch the data from the api
  const getData = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page + 1}`);
      const fetchedData = await response.json();
      setTotalRecords(fetchedData.pagination.total);
      return fetchedData;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async () => {
    const response = await getData(page);
    const fetchedData = response.data;
    // I am mapping only the required fields

    setTableItems(
      fetchedData.map(
        (item: {
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
          };
        }
      )
    );
  };

  // making this function to to save the ids of the selected items so taht it will persist
  // even after  teh page is refreshed

  const handleSelectionChange = (e: any) => {
    const selectedItems = e.value;
    const checkedItemsOnPage = selectedItems.map((item: any)=> item.id);

    const itemsOnPage = tableItems.map((item: any)=> item.id);
    const newCheckedItems = [
      ...checkedItems.filter(id => !itemsOnPage.includes(id)),
      ...checkedItemsOnPage
    ]
    setCheckedItems(newCheckedItems);
    localStorage.setItem('selectedIds', JSON.stringify(newCheckedItems));
  };

  const handlePageChange = (e: PaginatorPageChangeEvent) => {
    setPage(e.page);
  };

  useEffect(() => {
    handleFetchData();
  }, [page]);

  // In this useEffect I will restore the checked items from local storage
  useEffect(() => {
    const savedIds = localStorage.getItem('selectedIds');
    if (savedIds) {
      const selectedIds = JSON.parse(savedIds);
      //const restoreSelectedItems = tableItems.filter((item: any) => selectedIds.includes(item.id));
      setCheckedItems(selectedIds);
    }
  }, [tableItems]);

  const handleSubmit = () => {
    const N = Math.min(tocheck, tableItems.length);

    const newCheckedItems = [...checkedItems, ...tableItems.slice(0, N).map((item: any) => item.id)];
    setCheckedItems(newCheckedItems);
    localStorage.setItem('selectedIds', JSON.stringify(newCheckedItems));
    setTocheck(prev => prev - N);
    op.current?.hide();
  }


  const handleChange = (e : any) => {
    setTocheck(e.target.value);
  }

  const op = useRef<OverlayPanel>(null);

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 max-w-screen-xl mx-auto">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
          <i className="pi pi-chevron-down cursor-pointer" onClick={(e)=> op.current?.toggle(e)} style={{ color: 'slateblue' }}></i>
          <OverlayPanel ref={op}>
            <div className = 'flex flex-col gap-2 bg-white p-4 border border-5 border-black'>
              <div className = 'pb-2 flex items-center'>
                <input onChange={handleChange} className='border border-gray-700 p-2' type="text" />
              </div>
              <div className = 'flex items-center justify-center bg-blue-500'>
                <button onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </OverlayPanel>
            {loading ? (
              <div className="flex justify-center items-center h-40 text-lg text-gray-500">
                Loading data...
              </div>
            ) : (
              <DataTable
                value={tableItems}
                selectionMode="multiple"
                selection={tableItems.filter((item : any) => checkedItems.includes(item.id))}
                onSelectionChange={handleSelectionChange}
                tableStyle={{ minWidth: '50rem' }}
                dataKey="id"
                className="min-w-full"
                stripedRows
                responsiveLayout="stack"
                breakpoint='960px'
              >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>

                <Column field="title" header="Title" />
                <Column field="place_of_origin" header="Place of Origin" />
                <Column field="artist_display" header="Artist Display" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="date_start" header="Date Start" />
                <Column field="date_end" header="Date End" />
              </DataTable>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
            <div className="rounded-md border border-gray-200 shadow-sm px-4 py-2 bg-white w-full max-w-md">
              <Paginator
                first={page * 12}
                rows={12}
                totalRecords={totalRecords}
                onPageChange={handlePageChange}
                className="flex justify-center text-sm [&_.p-paginator-element]:px-2 [&_.p-paginator-element]:py-1 [&_.p-paginator-element]:rounded [&_.p-paginator-element]:mx-1 [&_.p-highlight]:bg-blue-500 [&_.p-highlight]:text-white [&_.p-paginator-element:hover]:bg-blue-100 transition-all"
              />
            </div>
          </div>
      </div>
    </>
  );
};

export default Table;
