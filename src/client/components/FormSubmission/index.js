import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress
} from '@material-ui/core';
import { 
  getFormById, 
  submitFormData 
} from '../../services/formService';

const FormSubmission = ({ formId }) => {
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (formId) {
      setLoading(true);
      getFormById(formId)
        .then(data => {
          setForm(data);
          // フォームデータの初期値を設定
          const initialData = {};
          data.fields.forEach(field => {
            initialData[field.field_id] = '';
          });
          setFormData(initialData);
          setLoading(false);
        })
        .catch(err => {
          setError('フォームの読み込みに失敗しました');
          setLoading(false);
        });
    }
  }, [formId]);

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await submitFormData(formId, formData);
      // 送信成功処理
      setSubmitting(false);
    } catch (err) {
      setError('データの送信に失敗しました');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!form) {
    return <Typography>フォームが見つかりません</Typography>;
  }

  return (
    <Box p={2}>
      <Typography variant="h5">{form.form_name}</Typography>
      <Paper>
        <Box p={3}>
          {form.fields.map(field => (
            <Box key={field.field_id} mb={2}>
              {field.field_type === 'text' && (
                <TextField
                  fullWidth
                  label={field.field_label}
                  value={formData[field.field_id] || ''}
                  onChange={(e) => handleInputChange(field.field_id, e.target.value)}
                  required={field.is_required}
                />
              )}
              
              {field.field_type === 'number' && (
                <TextField
                  fullWidth
                  type="number"
                  label={field.field_label}
                  value={formData[field.field_id] || ''}
                  onChange={(e) => handleInputChange(field.field_id, e.target.value)}
                  required={field.is_required}
                />
              )}
              
              {field.field_type === 'date' && (
                <TextField
                  fullWidth
                  type="date"
                  label={field.field_label}
                  InputLabelProps={{ shrink: true }}
                  value={formData[field.field_id] || ''}
                  onChange={(e) => handleInputChange(field.field_id, e.target.value)}
                  required={field.is_required}
                />
              )}
              
              {field.field_type === 'select' && (
                <FormControl fullWidth>
                  <InputLabel>{field.field_label}</InputLabel>
                  <Select
                    value={formData[field.field_id] || ''}
                    onChange={(e) => handleInputChange(field.field_id, e.target.value)}
                    required={field.is_required}
                  >
                    {field.options.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              
              {field.field_type === 'checkbox' && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!formData[field.field_id]}
                      onChange={(e) => handleInputChange(field.field_id, e.target.checked)}
                    />
                  }
                  label={field.field_label}
                />
              )}
            </Box>
          ))}
          
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : '送信'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormSubmission; 