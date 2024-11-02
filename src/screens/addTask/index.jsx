import { Formik } from 'formik';
import { StyleSheet, View, Alert } from 'react-native';
import { Input, Button, RadioGroup, Radio } from '@ui-kitten/components';
import CustomDatePicker from '../../components/ui/customDatePicker';
import taskSchema from '../../utils/validation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { status } from '../../utils/constant';
import uuid from 'react-native-uuid';

const AddTask = () => {
  const saveTask = async values => {
    try {
      // Önce mevcut görevleri alıyoruz
      const savedTasks = await AsyncStorage.getItem('tasks');
      let myTask = savedTasks ? JSON.parse(savedTasks) : [];
      
      // Göreve benzersiz bir id atıyoruz
      const newTask = { ...values, id: uuid.v4() };
      
      // Yeni görevi mevcut görevlere ekliyoruz
      myTask.push(newTask);
      
      // Güncellenmiş görev listesini kaydediyoruz
      await AsyncStorage.setItem('tasks', JSON.stringify(myTask));
      
      // Başarılı kaydetme durumunda bilgi mesajı gösterebiliriz
      Alert.alert("Success", "Task saved successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          title: 'Software',
          description: 'React native will be practiced.',
          startDate: null,
          endDate: null,
          category: null,
          status: status.ONGOING,
        }}
        validationSchema={taskSchema}
        onSubmit={values => saveTask(values)}>
        {({ handleChange, handleSubmit, values, setFieldValue, errors }) => (
          <View>
            <Input
              size="large"
              style={{ marginVertical: 10 }}
              value={values.title}
              label={'Title'}
              placeholder=""
              onChangeText={handleChange('title')}
              status={errors.title ? 'danger' : 'basic'}
              caption={errors.title}
            />
            <Input
              multiline
              size="large"
              style={{ marginVertical: 10 }}
              value={values.description}
              label={'Description'}
              placeholder=""
              onChangeText={handleChange('description')}
              status={errors.description ? 'danger' : 'basic'}
              caption={errors.description}
            />
            <CustomDatePicker
              size="large"
              style={{ marginVertical: 10 }}
              date={values.startDate}
              label={'Start Date'}
              onSelectDate={date => setFieldValue('startDate', date)}
              status={errors.startDate ? 'danger' : 'basic'}
              caption={errors.startDate}
            />
            <CustomDatePicker
              size="large"
              style={{ marginVertical: 10 }}
              date={values.endDate}
              label={'End Date'}
              onSelectDate={date => setFieldValue('endDate', date)}
              status={errors.endDate ? 'danger' : 'basic'}
              caption={errors.endDate}
            />

            <RadioGroup
              selectedIndex={values.category}
              onChange={index => setFieldValue('category', index)}>
              <Radio status="success">Software</Radio>
              <Radio status="success">Design</Radio>
              <Radio status="success">Operation</Radio>
            </RadioGroup>

            <Button
              status="success"
              style={{ marginTop: 30 }}
              onPress={handleSubmit}>
              CREATE
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
});
