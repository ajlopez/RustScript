
fn fibo(n) {
    if n == 0 {
        1
    }
    else if n == 1 {
        1
    }
    else {
        fibo(n - 1) + fibo(n - 2)
    }
}

fn main() {
    let n = 0;
    
    while n <= 20 {
        println!(fibo(n));
        n = n + 1;
    }
}

