const API_URL =
  "https://dashboard-ekonomi-daerah-production.up.railway.app";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [pdrb, setPdrb] = useState([]);
  const [kemiskinan, setKemiskinan] = useState([]);
  const [pengangguran, setPengangguran] = useState([]);
  const [searchPdrb, setSearchPdrb] = useState('');

const [searchKemiskinan, setSearchKemiskinan] = useState('');

const [searchPengangguran, setSearchPengangguran] = useState('');
const [currentPagePdrb, setCurrentPagePdrb] = useState(1);
const [currentPageKemiskinan, setCurrentPageKemiskinan] = useState(1);
const [currentPagePengangguran, setCurrentPagePengangguran] = useState(1);

const itemsPerPage = 5;


  const [formPdrb, setFormPdrb] = useState({
  tahun: '',
  kota: '',
  sektor: '',
  nilai_pdrb: '',
});
const [editPdrbId, setEditPdrbId] = useState(null);
const [editKemiskinanId, setEditKemiskinanId] = useState(null);
const [formKemiskinan, setFormKemiskinan] = useState({
  tahun: '',
  kota: '',
  jumlah_miskin: '',
  persentase: '',
});
const [formPengangguran, setFormPengangguran] = useState({
  tahun: '',
  kota: '',
  tpt: '',
});

const [editPengangguranId, setEditPengangguranId] = useState(null);
const [csvFile, setCsvFile] = useState(null);
 useEffect(() => {
  fetch(`${API_URL}/api/pdrb`)
    .then((res) => res.json())
    .then((data) => setPdrb(data));

  fetch(`${API_URL}/api/kemiskinan`)
    .then((res) => res.json())
    .then((data) => setKemiskinan(data));

  fetch(`${API_URL}/api/pengangguran`)
    .then((res) => res.json())
    .then((data) => setPengangguran(data));
}, []);

const handleUploadCsvPdrb = async () => {
  if (!csvFile) {
    alert('Pilih file CSV terlebih dahulu');
    return;
  }

  const formData = new FormData();
  formData.append('file', csvFile);

  try {
    const response = await fetch(
      `${API_URL}/api/pdrb/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    alert(data.message);

    fetch(`${API_URL}/api/pdrb`)
      .then((res) => res.json())
      .then((data) => setPdrb(data));

  } catch (error) {
    console.error(error);

    alert('Upload CSV gagal');
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const url = editPdrbId
  ? `${API_URL}/api/pdrb/${editPdrbId}`
  : `${API_URL}/api/pdrb`;

const method = editPdrbId ? 'PUT' : 'POST';

const response = await fetch(url, {
  method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formPdrb),
      }
    );

    const data = await response.json();

    alert(data.message);

    setFormPdrb({
      tahun: '',
      kota: '',
      sektor: '',
      nilai_pdrb: '',
    });
    setEditPdrbId(null);

fetch(`${API_URL}/api/pdrb`)
  .then((res) => res.json())
  .then((data) => setPdrb(data));

  } catch (error) {
    console.error(error);
    alert('Gagal menambahkan data');
  }
};
const handleSubmitKemiskinan = async (e) => {
  e.preventDefault();

  try {
    const url = editKemiskinanId
  ? `${API_URL}/api/kemiskinan/${editKemiskinanId}`
  : `${API_URL}/api/kemiskinan`;

const method = editKemiskinanId
  ? 'PUT'
  : 'POST';

const response = await fetch(url, {
  method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formKemiskinan),
      }
    );

    const data = await response.json();

    alert(data.message);

    setFormKemiskinan({
      tahun: '',
      kota: '',
      jumlah_miskin: '',
      persentase: '',
    });
    setEditKemiskinanId(null);

    // Refresh data
    fetch(`${API_URL}/api/kemiskinan`)
      .then((res) => res.json())
      .then((data) => setKemiskinan(data));

  } catch (error) {
    console.error(error);
    alert('Gagal menambahkan data kemiskinan');
  }
};

const handleSubmitPengangguran = async (e) => {
  e.preventDefault();

  try {
    const url = editPengangguranId
      ? `${API_URL}/api/pengangguran/${editPengangguranId}`
      : `${API_URL}/api/pengangguran`;

    const method = editPengangguranId
      ? 'PUT'
      : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formPengangguran),
    });

    const data = await response.json();

    alert(data.message);

    setFormPengangguran({
      tahun: '',
      kota: '',
      tpt: '',
    });
    setEditPengangguranId(null);

    fetch(`${API_URL}/api/pengangguran`)
      .then((res) => res.json())
      .then((data) => setPengangguran(data));

  } catch (error) {
    console.error(error);
    alert('Gagal menambahkan data pengangguran');
  }
};
const handleEditPdrb = (item) => {
  setFormPdrb({
    tahun: item.tahun,
    kota: item.kota,
    sektor: item.sektor,
    nilai_pdrb: item.nilai_pdrb,
  });

  setEditPdrbId(item.id);
};
const handleDeletePdrb = async (id) => {
  const konfirmasi = window.confirm(
    'Yakin ingin menghapus data ini?'
  );

  if (!konfirmasi) return;

  try {
    const response = await fetch(
      `${API_URL}/api/pdrb/${id}`,
      {
        method: 'DELETE',
      }
    );

    const data = await response.json();

    alert(data.message);

    fetch(`${API_URL}/api/pdrb`)
      .then((res) => res.json())
      .then((data) => setPdrb(data));

  } catch (error) {
    console.error(error);

    alert('Gagal menghapus data');
  }
};
const handleEditKemiskinan = (item) => {
  setFormKemiskinan({
    tahun: item.tahun,
    kota: item.kota,
    jumlah_miskin: item.jumlah_miskin,
    persentase: item.persentase,
  });

  setEditKemiskinanId(item.id);
};

const handleDeleteKemiskinan = async (id) => {
  try {
    const response = await fetch(
      `${API_URL}/api/kemiskinan/${id}`,
      {
        method: 'DELETE',
      }
    );

    const data = await response.json();

    alert(data.message);

    setKemiskinan(
      kemiskinan.filter(
        (item) => item.id !== id
      )
    );
  } catch (error) {
    console.error(error);
    alert('Gagal menghapus data');
  }
};

const handleEditPengangguran = (item) => {
  setFormPengangguran({
    tahun: item.tahun,
    kota: item.kota,
    tpt: item.tpt,
  });

  setEditPengangguranId(item.id);
};
const handleDeletePengangguran = async (id) => {
  const konfirmasi = window.confirm(
    'Yakin ingin menghapus data ini?'
  );

  if (!konfirmasi) return;

  try {
    const response = await fetch(
      `${API_URL}/api/pengangguran/${id}`,
      {
        method: 'DELETE',
      }
    );

    const data = await response.json();

    alert(data.message);

    fetch(`${API_URL}/api/pengangguran`)
      .then((res) => res.json())
      .then((data) => setPengangguran(data));

  } catch (error) {
    console.error(error);

    alert('Gagal menghapus data');
  }
};

  console.log('PDRB:', pdrb);
console.log('Kemiskinan:', kemiskinan);
console.log('Pengangguran:', pengangguran);

const chartDataPdrb = {
  labels: pdrb.map((item) => item.kota),

  datasets: [
    {
      label: 'Nilai PDRB',

      data: pdrb.map(
        (item) => item.nilai_pdrb
      ),

      backgroundColor:
        'rgba(128, 0, 0, 0.7)',
    },
  ],
};
const chartDataKemiskinan = {
  labels: kemiskinan.map((item) => item.kota),

  datasets: [
    {
      label: 'Jumlah Penduduk Miskin',

      data: kemiskinan.map(
        (item) => item.jumlah_miskin
      ),

      backgroundColor:
        'rgba(128, 0, 0, 0.7)',
    },
  ],
};
const chartDataPengangguran = {
  labels: pengangguran.map(
    (item) => item.kota
  ),

  datasets: [
    {
      label: 'Tingkat Pengangguran Terbuka (%)',

      data: pengangguran.map(
        (item) => item.tpt
      ),

      backgroundColor:
        'rgba(128, 0, 0, 0.7)',
    },
  ],
};

const filteredPdrb = pdrb.filter((item) =>
  item.kota
    .toLowerCase()
    .includes(searchPdrb.toLowerCase())
);

const indexOfLastPdrb =
  currentPagePdrb * itemsPerPage;

const indexOfFirstPdrb =
  indexOfLastPdrb - itemsPerPage;

const currentPdrb =
  filteredPdrb.slice(
    indexOfFirstPdrb,
    indexOfLastPdrb
  );

const totalPagesPdrb = Math.ceil(
  filteredPdrb.length / itemsPerPage
);

const filteredKemiskinan = kemiskinan.filter((item) =>
  item.kota
    .toLowerCase()
    .includes(searchKemiskinan.toLowerCase())
);

const indexOfLastKemiskinan =
  currentPageKemiskinan * itemsPerPage;

const indexOfFirstKemiskinan =
  indexOfLastKemiskinan - itemsPerPage;

const currentKemiskinan =
  filteredKemiskinan.slice(
    indexOfFirstKemiskinan,
    indexOfLastKemiskinan
  );

const totalPagesKemiskinan = Math.ceil(
  filteredKemiskinan.length / itemsPerPage
);

const filteredPengangguran = pengangguran.filter(
  (item) =>
    item.kota
      .toLowerCase()
      .includes(
        searchPengangguran.toLowerCase()
      )
);

const indexOfLastPengangguran =
  currentPagePengangguran * itemsPerPage;

const indexOfFirstPengangguran =
  indexOfLastPengangguran - itemsPerPage;

const currentPengangguran =
  filteredPengangguran.slice(
    indexOfFirstPengangguran,
    indexOfLastPengangguran
  );

const totalPagesPengangguran = Math.ceil(
  filteredPengangguran.length /
    itemsPerPage
);

const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Data'
  );

  const excelBuffer = XLSX.write(
    workbook,
    {
      bookType: 'xlsx',
      type: 'array',
    }
  );

  const fileData = new Blob(
    [excelBuffer],
    {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
  );

  saveAs(fileData, `${fileName}.xlsx`);
};
  return (
    <div className='dashboard'>
      <h1>Dashboard Ekonomi Daerah</h1>
      <div
  style={{
    width: '90%',
    margin: '30px auto',
  }}
>
  <h2>Grafik PDRB Daerah</h2>

  <Bar data={chartDataPdrb} />
</div>
<div
  style={{
    width: '90%',
    margin: '30px auto',
  }}
>
  <h2>Grafik Kemiskinan</h2>

  <Bar data={chartDataKemiskinan} />
  <div
  style={{
    width: '90%',
    margin: '30px auto',
  }}
>
  <h2>Grafik Pengangguran</h2>

  <Bar data={chartDataPengangguran} />
</div>

</div>

      <div className='summary-cards'>

  <div className='card'>
    <h2>{pdrb.length}</h2>
    <p>Data PDRB</p>
  </div>

  <div className='card'>
    <h2>{kemiskinan.length}</h2>
    <p>Data Kemiskinan</p>
  </div>

  <div className='card'>
    <h2>{pengangguran.length}</h2>
    <p>Data Pengangguran</p>
  </div>

</div>

    <div className='table-section'>
      <h2>Tambah Data PDRB</h2>
      <div style={{ marginBottom: '20px' }}>
  <input
    type='file'
    accept='.csv'
    onChange={(e) =>
      setCsvFile(e.target.files[0])
    }
  />

  <button
    type='button'
    onClick={handleUploadCsvPdrb}
  >
    Upload CSV
  </button>
</div>

<form onSubmit={handleSubmit}>  
  <input
    type='number'
    placeholder='Tahun'
    value={formPdrb.tahun}
    onChange={(e) =>
      setFormPdrb({
        ...formPdrb,
        tahun: e.target.value,
      })
    }
  />

  <input
    type='text'
    placeholder='Kota'
    value={formPdrb.kota}
    onChange={(e) =>
      setFormPdrb({
        ...formPdrb,
        kota: e.target.value,
      })
    }
  />

  <input
    type='text'
    placeholder='Sektor'
    value={formPdrb.sektor}
    onChange={(e) =>
      setFormPdrb({
        ...formPdrb,
        sektor: e.target.value,
      })
    }
  />

  <input
    type='number'
    placeholder='Nilai PDRB'
    value={formPdrb.nilai_pdrb}
    onChange={(e) =>
      setFormPdrb({
        ...formPdrb,
        nilai_pdrb: e.target.value,
      })
    }
  />

  <button type='submit'>
  {editPdrbId ? 'Update' : 'Tambah'}
</button>
</form>
  <h2>Data PDRB</h2>
  <button
  onClick={() =>
    exportToExcel(
      pdrb,
      'Data_PDRB'
    )
  }
>
  Export Excel
</button>
  <input
  className='search-box'
  type='text'
  placeholder='Cari kota PDRB...'
  value={searchPdrb}
  onChange={(e) =>
    setSearchPdrb(e.target.value)
  }
/>

  <table border='1' cellPadding='10'>
<thead>
  <tr>
    <th>Tahun</th>
    <th>Kota</th>
    <th>Sektor</th>
    <th>Nilai PDRB</th>
    <th>Aksi</th>
  </tr>
</thead>

    <tbody>
      {currentPdrb.map((item) => (
        <tr key={item.id}>
          <td>{item.tahun}</td>
          <td>{item.kota}</td>
          <td>{item.sektor}</td>
          <td>
            Rp {Number(item.nilai_pdrb).toLocaleString('id-ID')}
          </td>
         <td>
  <button
    onClick={() => handleEditPdrb(item)}
  >
    Edit
  </button>

  <button
    onClick={() => handleDeletePdrb(item.id)}
  >
    Hapus
  </button>
</td>
        </tr>
      ))}
    </tbody>
  </table>
  <div style={{ marginTop: '15px' }}>
  <button
    disabled={currentPagePdrb === 1}
    onClick={() =>
      setCurrentPagePdrb(
        currentPagePdrb - 1
      )
    }
  >
    Sebelumnya
  </button>

  <span
    style={{
      margin: '0 15px',
    }}
  >
    Halaman {currentPagePdrb} dari{' '}
    {totalPagesPdrb}
  </span>

  <button
    disabled={
      currentPagePdrb ===
      totalPagesPdrb
    }
    onClick={() =>
      setCurrentPagePdrb(
        currentPagePdrb + 1
      )
    }
  >
    Berikutnya
  </button>
</div>

</div>

      <div className='table-section'>
        <h2>Tambah Data Kemiskinan</h2>

<form onSubmit={handleSubmitKemiskinan}>
  <input
    type='number'
    placeholder='Tahun'
    value={formKemiskinan.tahun}
    onChange={(e) =>
      setFormKemiskinan({
        ...formKemiskinan,
        tahun: e.target.value,
      })
    }
  />

  <input
    type='text'
    placeholder='Kota'
    value={formKemiskinan.kota}
    onChange={(e) =>
      setFormKemiskinan({
        ...formKemiskinan,
        kota: e.target.value,
      })
    }
  />

  <input
    type='number'
    placeholder='Jumlah Miskin'
    value={formKemiskinan.jumlah_miskin}
    onChange={(e) =>
      setFormKemiskinan({
        ...formKemiskinan,
        jumlah_miskin: e.target.value,
      })
    }
  />

  <input
    type='number'
    step='0.01'
    placeholder='Persentase'
    value={formKemiskinan.persentase}
    onChange={(e) =>
      setFormKemiskinan({
        ...formKemiskinan,
        persentase: e.target.value,
      })
    }
  />

  <button type='submit'>
  {editKemiskinanId
    ? 'Update'
    : 'Tambah'}
</button>
</form>
  <h2>Data Kemiskinan</h2>
  <button
  onClick={() =>
    exportToExcel(
      kemiskinan,
      'Data_Kemiskinan'
    )
  }
>
  Export Excel
</button>
  <input
  className='search-box'
  type='text'
  placeholder='Cari kota Kemiskinan...'
  value={searchKemiskinan}
  onChange={(e) =>
    setSearchKemiskinan(e.target.value)
  }
/>
  <table border='1' cellPadding='10'>
    <thead>
  <tr>
    <th>Tahun</th>
    <th>Kota</th>
    <th>Jumlah Miskin</th>
    <th>Persentase</th>
    <th>Aksi</th>
  </tr>
</thead>

    <tbody>
      {currentKemiskinan.map((item) => (
        <tr key={item.id}>
          <td>{item.tahun}</td>
          <td>{item.kota}</td>
          <td>{item.jumlah_miskin}</td>
          <td>{item.persentase}%</td>
          <td>
  <button
    onClick={() =>
      handleEditKemiskinan(item)
    }
  >
    Edit
  </button>

  <button
    onClick={() =>
      handleDeleteKemiskinan(item.id)
    }
  >
    Hapus
  </button>
</td>
        </tr>
      ))}
    </tbody>
  </table>
  <div style={{ marginTop: '15px' }}>
  <button
    disabled={currentPageKemiskinan === 1}
    onClick={() =>
      setCurrentPageKemiskinan(
        currentPageKemiskinan - 1
      )
    }
  >
    Sebelumnya
  </button>

  <span style={{ margin: '0 15px' }}>
    Halaman {currentPageKemiskinan} dari{' '}
    {totalPagesKemiskinan}
  </span>

  <button
    disabled={
      currentPageKemiskinan ===
      totalPagesKemiskinan
    }
    onClick={() =>
      setCurrentPageKemiskinan(
        currentPageKemiskinan + 1
      )
    }
  >
    Berikutnya
  </button>
</div>

</div>

<div className='table-section'>
  <h2>Tambah Data Pengangguran</h2>

<form onSubmit={handleSubmitPengangguran}>
  <input
    type='number'
    placeholder='Tahun'
    value={formPengangguran.tahun}
    onChange={(e) =>
      setFormPengangguran({
        ...formPengangguran,
        tahun: e.target.value,
      })
    }
  />

  <input
    type='text'
    placeholder='Kota'
    value={formPengangguran.kota}
    onChange={(e) =>
      setFormPengangguran({
        ...formPengangguran,
        kota: e.target.value,
      })
    }
  />

  <input
    type='number'
    step='0.01'
    placeholder='TPT'
    value={formPengangguran.tpt}
    onChange={(e) =>
      setFormPengangguran({
        ...formPengangguran,
        tpt: e.target.value,
      })
    }
  />

  <button type='submit'>
  {editPengangguranId
    ? 'Update'
    : 'Tambah'}
</button>
</form>

  <h2>Data Pengangguran</h2>
  <button
  onClick={() =>
    exportToExcel(
      pengangguran,
      'Data_Pengangguran'
    )
  }
>
  Export Excel
</button>
  <input
  className='search-box'
  type='text'
  placeholder='Cari kota Pengangguran...'
  value={searchPengangguran}
  onChange={(e) =>
    setSearchPengangguran(e.target.value)
  }
/>

  <table border='1' cellPadding='10'>
    <thead>
      <tr>
        <th>Tahun</th>
        <th>Kota</th>
        <th>TPT</th>
        <th>Aksi</th>
      </tr>
    </thead>

    <tbody>
      {currentPengangguran.map((item) => (
        <tr key={item.id}>
          <td>{item.tahun}</td>
          <td>{item.kota}</td>
          <td>{item.tpt}%</td>
          <td>
  <button
    onClick={() =>
      handleEditPengangguran(item)
    }
  >
    Edit
  </button>

  <button
    onClick={() =>
      handleDeletePengangguran(item.id)
    }
  >
    Hapus
  </button>
</td>
        </tr>
      ))}
    </tbody>
  </table>
  <div style={{ marginTop: '15px' }}>
  <button
    disabled={
      currentPagePengangguran === 1
    }
    onClick={() =>
      setCurrentPagePengangguran(
        currentPagePengangguran - 1
      )
    }
  >
    Sebelumnya
  </button>

  <span style={{ margin: '0 15px' }}>
    Halaman {currentPagePengangguran} dari{' '}
    {totalPagesPengangguran}
  </span>

  <button
    disabled={
      currentPagePengangguran ===
      totalPagesPengangguran
    }
    onClick={() =>
      setCurrentPagePengangguran(
        currentPagePengangguran + 1
      )
    }
  >
    Berikutnya
  </button>
</div>

</div>
    </div>
  );
}

export default App;