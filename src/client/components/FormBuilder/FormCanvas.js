import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDrop } from 'react-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import FormFieldPreview from './FormFieldPreview';

const FormCanvas = ({ 
  fields, 
  onSelectField, 
  onReorderFields,
  selectedFieldIndex,
  formSettings
}) => {
  const { t } = useTranslation();
  
  // ドロップターゲットの設定
  const [{ isOver }, drop] = useDrop({
    accept: 'FIELD',
    drop: () => ({ name: 'FormCanvas' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  
  // ドラッグ＆ドロップによるフィールドの並べ替え
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    onReorderFields(
      result.source.index,
      result.destination.index
    );
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('formPreview')}
      </Typography>
      
      <Box 
        ref={drop} 
        sx={{ 
          minHeight: 300,
          backgroundColor: isOver ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
          transition: 'background-color 0.2s',
          borderRadius: 1,
          p: 2
        }}
      >
        {fields.length === 0 ? (
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 4, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 200,
              backgroundColor: 'rgba(0, 0, 0, 0.02)'
            }}
          >
            <Typography variant="body1" color="textSecondary" align="center" gutterBottom>
              {t('emptyFormHint')}
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              {t('dragFieldsToStart')}
            </Typography>
          </Paper>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="form-fields">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {fields.map((field, index) => (
                    <Draggable 
                      key={field.id} 
                      draggableId={field.id} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ 
                            mb: 2,
                            position: 'relative',
                            zIndex: snapshot.isDragging ? 9999 : 'auto'
                          }}
                        >
                          <Paper
                            variant="outlined"
                            sx={{ 
                              p: 2,
                              borderColor: selectedFieldIndex === index ? 'primary.main' : 'divider',
                              borderWidth: selectedFieldIndex === index ? 2 : 1,
                              cursor: 'pointer'
                            }}
                            onClick={() => onSelectField(index)}
                          >
                            <FormFieldPreview field={field} />
                          </Paper>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          {formSettings.showResetButton && (
            <Button 
              variant="outlined" 
              sx={{ mr: 1 }}
              disabled
            >
              {t('reset')}
            </Button>
          )}
          <Button 
            variant="contained" 
            color="primary"
            disabled
          >
            {formSettings.submitButtonText || t('submit')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FormCanvas; 