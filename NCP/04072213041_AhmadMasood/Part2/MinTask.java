import java.util.concurrent.Callable;

// c) Task to find min in a subrange of the array
public class MinTask implements Callable<Integer> {
    private final int[] data;
    private final int start;
    private final int end;   // end is exclusive

    public MinTask(int[] data, int start, int end) {
        this.data = data;
        this.start = start;
        this.end = end;
    }

    @Override
    public Integer call() {
        int localMin = Integer.MAX_VALUE;
        for (int i = start; i < end; i++) {
            if (data[i] < localMin) {
                localMin = data[i];
            }
        }
        return localMin;
    }
}
