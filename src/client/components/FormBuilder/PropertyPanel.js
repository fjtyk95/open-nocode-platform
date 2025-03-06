import React from 'react';
import { 
  Box, 
  Typography, 
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';

const PropertyPanel = ({ field, onUpdateField, onDeleteField, customFieldTypes = [] }) => {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [optionDialogOpen, setOptionDialogOpen] = useState(false);
  const [newOption, setNewOption] = useState({ value: '', label: '' });
  
  if (!field) return null;
  
  // カスタムフィールドタイプの場合、プラグインから設定コンポーネントを取得
  const customField = customFieldTypes.find(f => f.type === field.type);
  const CustomPropertiesComponent = customField?.PropertiesComponent;
  
  // フィールドプロパティの更新
  const handleChange = (prop, value) => {
    onUpdateField({ [prop]: value });
  };
  
  // 選択肢の並べ替え
  const handleOptionReorder = (result) => {
    if (!result.destination) return;
    
    const options = [...field.options];
    const [movedOption] = options.splice(result.source.index, 1);
    options.splice(result.destination.index, 0, movedOption);
    
    onUpdateField({ options });
  };
  
  // 選択肢の追加
  const handleAddOption = () => {
    if (!newOption.value || !newOption.label) return;
    
    const options = [...(field.options || []), newOption];
    onUpdateField({ options });
    setNewOption({ value: '', label: '' });
    setOptionDialogOpen(false);
  };
  
  // 選択肢の削除
  const handleDeleteOption = (index) => {
    const options = field.options.filter((_, i) => i !== index);
    onUpdateField({ options });
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('fieldProperties')}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label={t('fieldLabel')}
          value={field.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
          margin="normal"
          variant="outlined"
        />
        
        {field.type !== 'checkbox' && field.type !== 'radio' && (
          <TextField
            fullWidth
            label={t('placeholder')}
            value={field.placeholder || ''}
            onChange={(e) => handleChange('placeholder', e.target.value)}
            margin="normal"
            variant="outlined"
          />
        )}
        
        <TextField
          fullWidth
          label={t('helpText')}
          value={field.helpText || ''}
          onChange={(e) => handleChange('helpText', e.target.value)}
          margin="normal"
          variant="outlined"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={field.required || false}
              onChange={(e) => handleChange('required', e.target.checked)}
              color="primary"
            />
          }
          label={t('required')}
          sx={{ mt: 1 }}
        />
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* フィールドタイプ固有の設定 */}
      {(field.type === 'text' || field.type === 'textarea') && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('validationSettings')}
          </Typography>
          
          <TextField
            fullWidth
            label={t('minLength')}
            type="number"
            value={field.minLength || ''}
            onChange={(e) => handleChange('minLength', e.target.value)}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label={t('maxLength')}
            type="number"
            value={field.maxLength || ''}
            onChange={(e) => handleChange('maxLength', e.target.value)}
            margin="normal"
            variant="outlined"
          />
        </Box>
      )}
      
      {field.type === 'number' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('validationSettings')}
          </Typography>
          
          <TextField
            fullWidth
            label={t('min')}
            type="number"
            value={field.min || ''}
            onChange={(e) => handleChange('min', e.target.value)}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label={t('max')}
            type="number"
            value={field.max || ''}
            onChange={(e) => handleChange('max', e.target.value)}
            margin="normal"
            variant="outlined"
          />
        </Box>
      )}
      
      {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">
              {t('options')}
            </Typography>
            <Button
              startIcon={<AddIcon />}
              size="small"
              onClick={() => setOptionDialogOpen(true)}
            >
              {t('addOption')}
            </Button>
          </Box>
          
          <DragDropContext onDragEnd={handleOptionReorder}>
            <Droppable droppableId="options-list">
              {(provided) => (
                <List dense {...provided.droppableProps} ref={provided.innerRef}>
                  {field.options?.map((option, index) => (
                    <Draggable key={index} draggableId={`option-${index}`} index={index}>
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          divider
                        >
                          <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                            <DragIndicatorIcon fontSize="small" />
                          </Box>
                          <ListItemText
                            primary={option.label}
                            secondary={option.value}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => handleDeleteOption(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      )}
      
      {/* カスタムフィールドタイプの設定コンポーネント */}
      {CustomPropertiesComponent && (
        <Box sx={{ mb: 3 }}>
          <CustomPropertiesComponent
            field={field}
            onChange={onUpdateField}
          />
        </Box>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          {t('deleteField')}
        </Button>
      </Box>
      
      {/* 削除確認ダイアログ */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>{t('confirmDelete')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('deleteFieldConfirmation')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>
            {t('cancel')}
          </Button>
          <Button 
            color="error" 
            onClick={() => {
              onDeleteField();
              setIsDeleteDialogOpen(false);
            }}
          >
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 選択肢追加ダイアログ */}
      <Dialog
        open={optionDialogOpen}
        onClose={() => setOptionDialogOpen(false)}
      >
        <DialogTitle>{t('addOption')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('optionLabel')}
            value={newOption.label}
            onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label={t('optionValue')}
            value={newOption.value}
            onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOptionDialogOpen(false)}>
            {t('cancel')}
          </Button>
          <Button 
            color="primary" 
            onClick={handleAddOption}
            disabled={!newOption.value || !newOption.label}
          >
            {t('add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertyPanel; 