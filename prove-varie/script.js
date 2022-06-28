let dataset = [10, 20, 30, 40, 50]

const ul = d3.select('#list').append('ul')

ul.selectAll('li').data(dataset).join('li').text(d => d)

/* const add = () => {
    console.log('add', dataset)

    dataset.push(dataset[dataset.length - 1] + 10)

    const newul = d3.select('ul').selectAll('li')
        .data(dataset)
        .join(
            enter => enter.append('li').style('color', 'green'),
            update => update.style('color', 'purple'),
            exit => exit.remove()
        )
        .text(d => d)
    console.log(newul)
} */

/* const remove = () => {
    console.log('remove')

    dataset.pop()

    const newul = d3.select('ul').selectAll('li')
        .data(dataset)
        .join(
            enter => enter.append('li').style('color', 'green'),
            update => update.style('color', 'purple'),
            exit => exit.remove()
        )
        .text(d => d)
    console.log(newul)

} */

const edit = (val) => {

    val ? dataset.push(dataset[dataset.length - 1] + 10) : dataset.pop()

    d3.select('ul')
        .selectAll('li')
        .data(dataset)
        .join(
            enter => enter.append('li').style('color', 'green'),
            update => update.style('color', 'purple'),
            exit => exit.remove()
        )
        .text(d => d)

}


d3.select('#add').on('click', () => edit(true))
d3.select('#remove').on('click', () => edit(false))