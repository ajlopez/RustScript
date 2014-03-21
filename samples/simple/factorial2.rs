
fn factorial(n) {
    let mut f = 1;
    let mut k = n;
    
    while k > 1 {
        f = f * k;
        k = k - 1;
    }
    
    f
}

fn main() {
    let mut n = 1;
    
    while n <= 10 {
        println!(factorial(n));
        n = n + 1;
    }
}

