import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert
} from '@material-ui/core';
import FieldPalette from './FieldPalette';
import FormPreview from './FormPreview';
import PropertyPanel from './PropertyPanel';
import { saveForm, getFormById } from '../../services/formService';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormCanvas from './FormCanvas';
import FormSettings from './FormSettings';
import VersionControl from './VersionControl';

const FormBuilder = ({ formId, onSave }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    form_name: '',
    fields: []
  });
  const [selectedField, setSelectedField] = useState(null);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  useEffect(() => {
    if (formId) {
      // 既存フォームの読み込み
      getFormById(formId).then(data => {
        setFormData(data);
      });
    }
  }, [formId]);

  const handleDragEnd = (result) => {
    // ドラッグ＆ドロップの処理
    // ...
  };

  const handleFieldSelect = (fieldId) => {
    const field = formData.fields.find(f => f.id === fieldId);
    setSelectedField(field);
  };

  const handlePropertyChange = (property, value) => {
    // フィールドプロパティの変更処理
    // ...
  };

  const handleSaveForm = async () => {
    try {
      setLoading(true);
      
      const savedForm = formId
        ? await saveForm(formData)
        : await saveForm(formData);
      
      setNotification({
        open: true,
        message: t('messages.formSaved'),
        severity: 'success'
      });
      
      if (!formId) {
        navigate(`/forms/${savedForm.id}/edit`);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('フォーム保存エラー:', error);
      setNotification({
        open: true,
        message: t('errors.formSaveFailed'),
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // プラグインからのフィールドタイプを取得
  const customFieldTypes = pluginManager.getExtensions('fieldTypes');
  
  // フィールドの追加
  const handleAddField = useCallback((fieldType) => {
    const newField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label: t(`fieldTypes.${fieldType}.defaultLabel`),
      required: false,
      order: formData.fields.length
    };
    
    // フィールドタイプ固有の初期プロパティを追加
    if (fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') {
      newField.options = [
        { value: 'option1', label: t('option') + ' 1' },
        { value: 'option2', label: t('option') + ' 2' }
      ];
    }
    
    // カスタムフィールドタイプの場合、プラグインから初期設定を取得
    const customField = customFieldTypes.find(f => f.type === fieldType);
    if (customField && customField.getDefaultProps) {
      Object.assign(newField, customField.getDefaultProps());
    }
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    
    // 新しいフィールドを選択状態にする
    setSelectedFieldIndex(formData.fields.length);
  }, [formData, customFieldTypes, t]);
  
  // フィールドの選択
  const handleSelectField = useCallback((index) => {
    setSelectedFieldIndex(index);
  }, []);
  
  // フィールドの更新
  const handleUpdateField = useCallback((index, updates) => {
    setFormData(prev => {
      const updatedFields = [...prev.fields];
      updatedFields[index] = {
        ...updatedFields[index],
        ...updates
      };
      
      return {
        ...prev,
        fields: updatedFields
      };
    });
  }, []);
  
  // フィールドの削除
  const handleDeleteField = useCallback((index) => {
    setFormData(prev => {
      const updatedFields = prev.fields.filter((_, i) => i !== index);
      
      // 削除後のフィールド順序を更新
      updatedFields.forEach((field, i) => {
        field.order = i;
      });
      
      return {
        ...prev,
        fields: updatedFields
      };
    });
    
    setSelectedFieldIndex(null);
  }, []);
  
  // フィールドの並べ替え
  const handleReorderFields = useCallback((sourceIndex, destinationIndex) => {
    if (sourceIndex === destinationIndex) return;
    
    setFormData(prev => {
      const updatedFields = [...prev.fields];
      const [movedField] = updatedFields.splice(sourceIndex, 1);
      updatedFields.splice(destinationIndex, 0, movedField);
      
      // 並べ替え後のフィールド順序を更新
      updatedFields.forEach((field, i) => {
        field.order = i;
      });
      
      return {
        ...prev,
        fields: updatedFields
      };
    });
    
    setSelectedFieldIndex(destinationIndex);
  }, []);
  
  // フォーム設定の更新
  const handleUpdateFormSettings = useCallback((settings) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settings
      }
    }));
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            {formId ? t('editForm') : t('createForm')}
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              sx={{ mr: 1 }}
              onClick={() => navigate('/forms')}
            >
              {t('cancel')}
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSaveForm}
              disabled={loading}
            >
              {t('save')}
            </Button>
          </Box>
        </Box>
        
        <TextField
          fullWidth
          label={t('formName')}
          value={formData.form_name}
          onChange={(e) => setFormData({...formData, form_name: e.target.value})}
          margin="normal"
          variant="outlined"
        />
        
        <TextField
          fullWidth
          label={t('formDescription')}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          margin="normal"
          variant="outlined"
          multiline
          rows={2}
        />
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <FieldPalette 
                onAddField={handleAddField}
                customFieldTypes={customFieldTypes}
              />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, minHeight: 500 }}>
              <FormCanvas
                fields={formData.fields}
                onSelectField={handleSelectField}
                onReorderFields={handleReorderFields}
                selectedFieldIndex={selectedFieldIndex}
                formSettings={formData.settings}
              />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, height: '100%' }}>
              {selectedFieldIndex !== null ? (
                <PropertyPanel
                  field={formData.fields[selectedFieldIndex]}
                  onUpdateField={(updates) => handleUpdateField(selectedFieldIndex, updates)}
                  onDeleteField={() => handleDeleteField(selectedFieldIndex)}
                  customFieldTypes={customFieldTypes}
                />
              ) : (
                <FormSettings
                  settings={formData.settings}
                  onUpdateSettings={handleUpdateFormSettings}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
        
        {formId && (
          <Box sx={{ mt: 3 }}>
            <VersionControl formId={formId} />
          </Box>
        )}
      </Box>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </DndProvider>
  );
};

export default FormBuilder; 