import { defineComponent, ref } from 'vue';

const App = defineComponent({
  setup() {
    const count = ref(6);

    const inc = () => {
      count.value++;
    };

    return () => (
      <div>
        <h1>{count.value}</h1>
        <button onClick={() => count.value++}>+1</button>
      </div>
    );
  }
});

export default App;
