import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import HomeService from "../services/homeService";

const Home = () => {
  const [characters, setCharacters] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50
  });
  const [pageInfo, setPageInfo] = useState({
    isLoading: true,
    rowCount: 0
  });
  const [columnSetting] = useState({
    columns: [
      {
        field: 'id',
        headerName: 'Id',
        flex: 0.1,
        minWidth: 150,
      },
      {
        field: 'name',
        headerName: 'Nombre',
        flex: 0.5,
        minWidth: 150,
      },
      {
        field: 'description',
        headerName: 'Descripcion',
        flex: 2,
        minWidth: 100,
      },
      {
        field: 'comics',
        headerName: '# Comics',
        flex: 0.1,
        minWidth: 100,
        valueGetter: ({ row }) => {return row.comics.available}
      },
      {
        field: 'events',
        headerName: '# Eventos',
        flex: 0.1,
        minWidth: 100,
        valueGetter: ({ row }) => {return row.events.available}
      },
      {
        field: 'image',
        headerName: 'Imagen',
        flex: 0.1,
        minWidth: 120,
        renderCell: ({ row }) => (
          <img src={`${row.thumbnail.path}.${row.thumbnail.extension}`} alt="Character" style={{ width: 100, height: 100 }} />
        ),
      },
    ],
    initialState: {columns: {columnVisibilityModel: {id: false}}}
  });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: false,
    name: true,
    description: true,
    comics: true,
    events: true,
    image: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowDetails, setSelectedRowDetails] = useState(null);

  const handleRowClick = (params) => {
    const fetchData = async () => {
      try {
        const response = await HomeService.getCharactersById(params.row.id);
        setSelectedRowDetails(response.data[0]);
        setIsModalOpen(true);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: window.innerWidth <= 600 ? '38vh' : '50vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
  };

  const modalTitleStyle = {
    textAlign: 'center', // Centra el texto del título
    fontSize: '1.5rem', // Establece el tamaño de la fuente del título
    fontWeight: 'bold', // Puedes agregar negrita al texto del título si lo deseas
    marginBottom: '20px' // Agrega un margen inferior al título para separarlo del contenido
  };  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await HomeService.getAllCharacters({ offset: paginationModel.page * paginationModel.pageSize, limit: paginationModel.pageSize });
        setCharacters(response.data.results);

        const handleResize = () => {
          if (window.innerWidth <= 600) {
            setColumnVisibilityModel(prevState => ({
              ...prevState,
              description: false,
              comics: false,
              events: false        
            }));
          } else {
            setColumnVisibilityModel(prevState => ({
              ...prevState,
              description: true,
              comics: true,
              events: true
            }));
          }
        };

        handleResize(); // Llamada inicial para establecer la visibilidad de las columnas

        window.addEventListener('resize', handleResize); // Agregar el listener del evento de cambio de tamaño de pantalla

        setPageInfo(prevPageInfo => ({
          ...prevPageInfo,
          isLoading: false,
          rowCount: response.data.total
        }));

        return () => {
          window.removeEventListener('resize', handleResize); // Eliminar el listener del evento de cambio de tamaño de pantalla al desmontar el componente
        };

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [paginationModel]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <DataGrid
        rows={characters}
        {...columnSetting}
        rowCount={pageInfo.rowCount}
        loading={pageInfo.isLoading}
        pageSizeOptions={[paginationModel.pageSize]}
        paginationModel={paginationModel}
        paginationMode="server"
        columnVisibilityModel={columnVisibilityModel}
        onPaginationModelChange={setPaginationModel}
        onRowClick={handleRowClick}
      />

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography sx={modalTitleStyle} id="modal-modal-title" variant="h2" component="h2">
            Detalles del personaje
          </Typography>
          {selectedRowDetails && (
            <div>
              <p><b>Nombre:</b> <br/> {selectedRowDetails.name}</p>
              <p><b>Descripcion:</b> <br/> {selectedRowDetails.description}</p>
              <p><b># Comics:</b> {selectedRowDetails.comics.available}</p>
              <p><b># Series:</b> {selectedRowDetails.series.available}</p>
              <p><b># Eventos:</b> {selectedRowDetails.events.available}</p>
              <p><b># Historias:</b> {selectedRowDetails.stories.available}</p>
              <div>
                <p><b>Imagen:</b></p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={`${selectedRowDetails.thumbnail.path}.${selectedRowDetails.thumbnail.extension}`} alt="Imagen del personaje" style={{ width: '100%', maxWidth: '200px', height: 'auto' }} />
                </div>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Home;
