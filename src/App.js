import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import osm from './osm-providers';
import './App.css';
// L
import L from 'leaflet';

// Main App Component
function App() {
  const [record, setRecord] = useState({
    comments: '',
    commune: '',
    commune_id: '',
    date_demande: '',
    localisations: [],
    localisations_fda: '',
    numero: '',
    province: '',
    province_id: '',
    region: '',
    region_id: '',
    statut: '',
    superficie: '',
    type: '',
  });

  const handleEdit = (record) => {
    setRecord(record);
  }
  return (
    <>
      <RecordTable onEdit={handleEdit} />
      
          <PolygonMap record={record} />
    
        
      
    </>
  );
}

// PolygonMap Component
const PolygonMap = ({ record }) => {
  const [center] = useState({ lat: 24.4539, lng: 54.3773 });
  const [mapLayers, setMapLayers] = useState([]);
  const ZOOM_LEVEL = 12;
  const mapRef = useRef();

  const handleCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === 'polygon') {
      const { _leaflet_id } = layer;
      setMapLayers((layers) => [
        ...layers,
        { id: _leaflet_id, latlngs: layer.getLatLngs()[0] },
      ]);
    }
  };

  const handleEdit = (e) => {
    const { layers: { _layers } } = e;
    Object.values(_layers).forEach(({ _leaflet_id, editing }) => {
      setMapLayers((layers) =>
        layers.map((l) =>
          l.id === _leaflet_id
            ? { ...l, latlngs: editing.latlngs[0] }
            : l
        )
      );
    });
  };

  const handleDelete = (e) => {
    const { layers: { _layers } } = e;
    Object.values(_layers).forEach(({ _leaflet_id }) => {
      setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id));
    });
  };


  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.leafletElement;
      map.setView(center, ZOOM_LEVEL);
    }
  }
  , [center]);

  useEffect(() => {
    if (mapRef.current) {
      setMapLayers(record.localisations);
      // const map = mapRef.current.leafletElement;
      // map.eachLayer((layer) => {
      //   if (layer instanceof L.Polygon) {
      //     map.removeLayer(layer);
      //   }
      // });

      // record.localisations.forEach((localisation) => {
      //   const polygon = L.polygon(localisation.latlngs, { color: 'red' });
      //   polygon.addTo(map);
      // });
    }
  }, [record, mapRef]);

  return (
    <div className="row">
      <div className="col text-center">
        <div className="col">
          <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
            <FeatureGroup>
              <EditControl
                position="topright"
                onCreated={handleCreate}
                onEdited={handleEdit}
                onDeleted={handleDelete}
                draw={{
                  rectangle: false,
                  polyline: false,
                  circle: false,
                  circlemarker: false,
                  marker: false,
                }}
                // add the polygon to the map
                
              />
              {
                mapLayers.map((layer) => (
                  <L.Polygon key={layer.id} positions={layer.latlngs} color="red" />
                ))
              }

            </FeatureGroup>

            <TileLayer
              url={osm.maptiler.url}
              attribution={osm.maptiler.attribution}
            />
          </MapContainer>

          <pre className="text-left">
            {JSON.stringify(mapLayers, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

// RecordTable Component
const RecordTable = ({ onEdit }) => {
  const [records, setRecords] = useState([
    {
      id: 3,
      comments: 'Sample comment 3',
      commune: 'Commune 3',
      commune_id: 'C3',
      date_demande: '2024-05-03',
      localisations: [
        {
          "id": 193,
          "latlngs": [
            {
              "lat": 24.56461038017685,
              "lng": 54.455795288085945
            },
            {
              "lat": 24.543687907411208,
              "lng": 54.42386627197266
            },
            {
              "lat": 24.542750998636013,
              "lng": 54.39949035644532
            },
            {
              "lat": 24.51963836811676,
              "lng": 54.41150665283204
            },
            {
              "lat": 24.505893706264033,
              "lng": 54.45545196533204
            },
            {
              "lat": 24.52651013514909,
              "lng": 54.46506500244141
            }
          ]
        }
      ],      
      localisations_fda: 'Location FDA 3',
      numero: '125',
      province: 'Province 3',
      province_id: 'P3',
      region: 'Region 3',
      region_id: 'R3',
      statut: 'Rejected',
      superficie: 150.25,
      type: 'Type C',
    },
  ]);

  useEffect(() => {
    // Fetch data from the API
    fetch('http://173.249.58.11:8080/vafa_api/api/semenses')
      .then(response => response.json())
      .then(data => setRecords(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleEdit = (record) => {
    onEdit(record);
  }

  return (
    <div className="record-table">
      <h2>Records</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Comments</th>
            <th>Commune</th>
            <th>Commune ID</th>
            <th>Date Demande</th>
            <th>Localisations FDA</th>
            <th>Numero</th>
            <th>Province</th>
            <th>Province ID</th>
            <th>Region</th>
            <th>Region ID</th>
            <th>Statut</th>
            <th>Superficie</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.comments}</td>
              <td>{record.commune}</td>
              <td>{record.commune_id}</td>
              <td>{new Date(record.date_demande).toLocaleDateString()}</td>
              <td>{record.localisations_fda}</td>
              <td>{record.numero}</td>
              <td>{record.province}</td>
              <td>{record.province_id}</td>
              <td>{record.region}</td>
              <td>{record.region_id}</td>
              <td>{record.statut}</td>
              <td>{record.superficie}</td>
              <td>{record.type}</td>
              <td>
                <button onClick={() => handleEdit(record)}>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
