
fn factorial(n) {
    let f = 1;
    
    while n > 1 {
        f = f * n;
        n = n - 1;
    }
    
    f
}

fn main() {
    let n = 1;
    
    while n <= 10 {
        println!(factorial(n));
        n = n + 1;
    }
}

