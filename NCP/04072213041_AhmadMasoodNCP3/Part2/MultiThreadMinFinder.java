import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class MultiThreadMinFinder {

    // c) Find minimum using multithreading with given number of threads
    public static int findMin(int[] data, int threadCount)
            throws InterruptedException, ExecutionException {

        if (data.length == 0) {
            throw new IllegalArgumentException("Array is empty.");
        }

        ExecutorService service = Executors.newFixedThreadPool(threadCount);
        List<Future<Integer>> futures = new ArrayList<>();

        int chunkSize = (int) Math.ceil(data.length / (double) threadCount);

        for (int t = 0; t < threadCount; t++) {
            int start = t * chunkSize;
            int end = Math.min(start + chunkSize, data.length);
            if (start >= end) {
                break;
            }
            MinTask task = new MinTask(data, start, end);
            futures.add(service.submit(task));
        }

        int globalMin = Integer.MAX_VALUE;
        try {
            for (Future<Integer> f : futures) {
                int localMin = f.get();
                if (localMin < globalMin) {
                    globalMin = localMin;
                }
            }
        } finally {
            service.shutdown();
        }

        return globalMin;
    }
}
