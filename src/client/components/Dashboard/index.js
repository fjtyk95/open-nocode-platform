import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@material-ui/core';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
  getDashboardData,
  getFormsList
} from '../../services/dashboardService';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [dashboardData, setDashboardData] = useState(null);
  
  useEffect(() => {
    // フォーム一覧を取得
    getFormsList().then(data => {
      setForms(data);
      if (data.length > 0) {
        setSelectedForm(data[0].form_id);
      }
    });
  }, []);
  
  useEffect(() => {
    if (selectedForm) {
      // ダッシュボードデータを取得
      getDashboardData(selectedForm, dateRange.startDate, dateRange.endDate)
        .then(data => {
          setDashboardData(data);
        });
    }
  }, [selectedForm, dateRange]);

  const handleFormChange = (event) => {
    setSelectedForm(event.target.value);
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box p={2}>
      <Typography variant="h5">ダッシュボード</Typography>
      
      <Box mb={3} mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>フォーム選択</InputLabel>
              <Select
                value={selectedForm}
                onChange={handleFormChange}
              >
                {forms.map(form => (
                  <MenuItem key={form.form_id} value={form.form_id}>
                    {form.form_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="開始日"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="終了日"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
      
      {dashboardData && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper>
              <Box p={2}>
                <Typography variant="h6">ステータス別件数</Typography>
                <Box height={300}>
                  <Pie
                    data={dashboardData.statusChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper>
              <Box p={2}>
                <Typography variant="h6">日別申請件数</Typography>
                <Box height={300}>
                  <Line
                    data={dashboardData.dailySubmissions}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper>
              <Box p={2}>
                <Typography variant="h6">部署別集計</Typography>
                <Box height={300}>
                  <Bar
                    data={dashboardData.departmentChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard; 